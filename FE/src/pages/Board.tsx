import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  KanbanBoardProvider,
  KanbanBoard,
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnTitle,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardCard,
  KanbanBoardCardTitle,
  KanbanBoardCardDescription,
  KanbanBoardColumnFooter,
  type KanbanBoardDropDirection,
} from "@/components/kanban";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { useLists } from "@/hooks/useLists";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { CreateList } from "@/components/lists/CreateList";
import { CreateCard } from "@/components/cards/CreateCard";
import { HeaderBoard } from "@/components/boards/HeaderBoard";
import { useBoards } from "@/hooks/useBoards";
import { axiosClient } from "@/lib/apiClient";
import { Outlet } from "react-router-dom";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { MessageSquareText, SquareCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCardsStore } from "@/stores/cards.store";
type List = {
  id: string;
  name: string;
  position: number;
};

type Card = {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  cardLabels?: any[];
  cardMembers?: any[];
  checklists?: any[];
  commentsCount?: number;
};

export function Board() {
  const boardId = useParams().boardId as string;
  const navigate = useNavigate();
  const { board, fetchBoard } = useBoards();
  const {
    lists,
    createList,
    loading: listsLoading,
    fetchLists,
  } = useLists(boardId);

  // Lấy cards từ Zustand Store
  const { cards, setCards } = useCardsStore();
  // Fetch cards từ API và lưu vào store
  const fetchCardsForBoard = async (targetListIds: string[]) => {
    if (!targetListIds.length) {
      setCards([]);
      return;
    }

    try {
      const cardsByList = await Promise.all(
        targetListIds.map(async (listId) => {
          const response = await apiClient.get(`/lists/${listId}/cards`);

          const payload = (response as { data?: unknown }).data ?? response;
          const listCards = Array.isArray(payload) ? payload : [];
          return listCards.map((card: any) => ({ ...card, listId }));
        }),
      );

      setCards(cardsByList.flat());
    } catch (error) {
      console.error("❌ Failed to fetch cards:", error);
    }
  };

  const listIds = useMemo(() => lists.map((list) => list.id), [lists]);
  const listIdsKey = listIds.join(","); //  string ổn định, không tạo reference mới

  useEffect(() => {
    if (listIds.length) {
      fetchCardsForBoard(listIds);
    }
  }, [listIdsKey]);

  // Create card và lưu vào store
  const createCard = async (listId: string, title: string) => {
    try {
      const response = await apiClient.post(`/lists/${listId}/cards`, {
        title,
      });

      const newCard = response.data ?? response;
      if (newCard && typeof newCard === "object" && "id" in newCard) {
        // Thêm card mới vào store
        setCards([...cards, { ...newCard, listId }]);
      }
    } catch (error) {
      console.error("❌ Failed to create card:", error);
    }
  };

  const [columnOrder, setColumnOrder] = useState<string[] | null>(null);
  const baseColumns = useMemo<List[]>(
    () =>
      [...lists]
        .sort((a: List, b: List) => a.position - b.position)
        .map((list: List) => ({
          id: list.id,
          name: list.name,
          position: list.position,
        })),
    [lists],
  );

  const columns = useMemo<List[]>(() => {
    if (!columnOrder) {
      return baseColumns;
    }

    const columnsMap = new Map(
      baseColumns.map((column) => [column.id, column]),
    );
    const orderedColumns = columnOrder
      .map((columnId) => columnsMap.get(columnId))
      .filter((column): column is List => Boolean(column));

    const missingColumns = baseColumns.filter(
      (column) => !columnOrder.includes(column.id),
    );

    return [...orderedColumns, ...missingColumns];
  }, [baseColumns, columnOrder]);

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const defaultTasks = useMemo<Card[]>(() => cards, [cards]);

  const [tasks, setTasks] = useState<Card[]>([]);
  const tasksToRender = tasks.length ? tasks : defaultTasks;

  /**
   * XỬ LÝ KÉO THẢ CỘT
   */
  function handleColumnDragStart(e: React.DragEvent, columnId: string) {
    // QUAN TRỌNG: stopPropagation để ngăn event bubble lên parent
    e.stopPropagation();
    setDraggedColumnId(columnId);
    // Đánh dấu đây là column drag, không phải card drag
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-kanban-column", columnId);
  }

  function handleColumnDragOver(e: React.DragEvent, columnId: string) {
    // Chỉ xử lý nếu đang kéo column (không phải card)
    if (!e.dataTransfer.types.includes("application/x-kanban-column")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (draggedColumnId && draggedColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  }

  async function handleColumnDrop(e: React.DragEvent, targetColumnId: string) {
    // Chỉ xử lý nếu đang kéo column
    if (!e.dataTransfer.types.includes("application/x-kanban-column")) {
      return;
    }
    console.log("Column drop detected");

    e.preventDefault();
    e.stopPropagation();

    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      return;
    }

    const sourceColumns =
      columnOrder?.length === columns.length
        ? columnOrder
            .map((columnId) => columns.find((column) => column.id === columnId))
            .filter((column): column is List => Boolean(column))
        : columns;

    const newColumns = [...sourceColumns];
    const draggedIndex = newColumns.findIndex(
      (col) => col.id === draggedColumnId,
    );
    const targetIndex = newColumns.findIndex(
      (col) => col.id === targetColumnId,
    );

    if (draggedIndex < 0 || targetIndex < 0) {
      return columnOrder;
    }

    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    const beforeListId = newColumns[targetIndex - 1]?.id;
    const afterListId = newColumns[targetIndex + 1]?.id;

    //goi api
    try {
      const response = await axiosClient.patch(
        `/lists/${draggedColumn.id}/move`,
        {
          beforeListId,
          afterListId,
        },
      );
      setColumnOrder(newColumns.map((column) => column.id));
      console.log("Update column position response:", response);
    } catch (error) {
      setColumnOrder(sourceColumns.map((column) => column.id));
      console.error("Error updating column position:", error);
    }

    setDraggedColumnId(null);
    setDragOverColumnId(null);
  }

  function handleColumnDragEnd() {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  }

  /**
   * XỬ LÝ KÉO THẢ CARD
   */
  // Khi thả vào cột hoặc vùng trống (không phải thả vào card cụ thể)
  async function handleDropOverColumn(columnId: string, data: string) {
    try {
      console.log("Drop over column:", columnId, "with data:", data);
      const taskData = JSON.parse(data) as Card;
      console.log("Parsed task data:", taskData);
      if (taskData.listId === columnId) {
        return;
      }

      const sourceTasks = (tasks.length ? tasks : defaultTasks).map((task) =>
        task.id === taskData.id ? { ...task, listId: columnId } : task,
      );
      setTasks(sourceTasks);
      try {
        await axiosClient.patch(`/cards/${taskData.id}/move`, {
          targetListId: columnId,
        });
        console.log("✅ Update card position response");
      } catch (error) {
        setTasks(tasks);
        console.error("❌ Error updating card position:", error);
      }
    } catch (error) {
      console.error("Error parsing task data:", error);
    }
  }

  // Khi thả vào một card cụ thể, cần biết thả ở trên hay dưới card đó để tính toán vị trí mới
  async function handleDropOverListItem(
    targetCardId: string,
    data: string,
    direction: KanbanBoardDropDirection,
  ) {
    if (direction === "none") {
      return;
    }

    try {
      console.log(
        `Drop over card: ${targetCardId} with data:`,
        data,
        `and direction: ${direction}`,
      );
      //const draggedTask = JSON.parse(data) as Task;
      const draggedTask = JSON.parse(data);
      if (draggedTask.id === targetCardId) {
        return;
      }

      const currentTasks = tasks.length ? tasks : defaultTasks;
      const targetTask = currentTasks.find((task) => task.id === targetCardId);
      if (!targetTask) return;

      const tasksWithoutDragged = currentTasks.filter(
        (task) => task.id !== draggedTask.id,
      );

      const targetIndex = tasksWithoutDragged.findIndex(
        (task) => task.id === targetCardId,
      );

      const insertIndex = direction === "top" ? targetIndex : targetIndex + 1;

      const newTasks = [
        ...tasksWithoutDragged.slice(0, insertIndex),
        { ...draggedTask, listId: targetTask.listId },
        ...tasksWithoutDragged.slice(insertIndex),
      ];

      const targetListId = targetTask.listId;
      const beforeCardId = newTasks[insertIndex - 1]?.id;
      const afterCardId = newTasks[insertIndex + 1]?.id;

      const oldTasks = tasks;
      setTasks(newTasks);
      try {
        await axiosClient.patch(`/cards/${draggedTask.id}/move`, {
          targetListId,
          beforeCardId,
          afterCardId,
        });
        console.log("Update card position response:");
      } catch (error) {
        setTasks(oldTasks);
        console.error("Error updating card position:", error);
      }

      return newTasks;
    } catch (error) {
      console.error("Error parsing task data:", error);
    }
  }

  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const startEditingColumn = (column: List) => {
    setEditingColumnId(column.id);
    setEditingColumnTitle(column.name);
  };

  const handleSaveColumnName = async (columnId: string) => {
    // Nếu rỗng thì thoát chế độ edit, không lưu
    if (!editingColumnTitle.trim()) {
      setEditingColumnId(null);
      return;
    }

    try {
      // 1. Gọi API update tên List (Sửa lại endpoint cho đúng với BE của bạn)
      await apiClient.patch(`/lists/${columnId}/update`, {
        name: editingColumnTitle,
      });

      fetchLists(boardId);
    } catch (error) {
      console.error("Lỗi khi đổi tên cột:", error);
    } finally {
      setEditingColumnId(null); // Tắt chế độ edit
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden relative">
        <HeaderBoard
          boardId={boardId}
          boardName={board?.name}
          boardMembers={board?.members ?? []}
          fetchBoard={fetchBoard}
        />
        <KanbanBoardProvider>
          <div className="h-screen p-4">
            <KanbanBoard>
              {columns.map((column) => (
                <div
                  key={column.id}
                  onDragOver={(e) => handleColumnDragOver(e, column.id)}
                  onDrop={(e) => handleColumnDrop(e, column.id)}
                  className={`transition-all ${
                    draggedColumnId === column.id ? "opacity-50" : ""
                  } ${
                    dragOverColumnId === column.id &&
                    draggedColumnId !== column.id
                      ? "scale-105"
                      : ""
                  }`}
                >
                  <KanbanBoardColumn
                    className="w-88 relative"
                    columnId={column.id}
                    onDropOverColumn={(data) =>
                      handleDropOverColumn(column.id, data)
                    }
                  >
                    {/* Header cột với drag handle */}
                    <KanbanBoardColumnHeader
                      draggable={editingColumnId !== column.id}
                      onDragStart={(e) => handleColumnDragStart(e, column.id)}
                      onDragEnd={handleColumnDragEnd}
                      className={
                        editingColumnId !== column.id ? "cursor-move" : ""
                      }
                    >
                      {editingColumnId === column.id ? (
                        <div className="w-full px-2">
                          <Input
                            value={editingColumnTitle}
                            onChange={(e) =>
                              setEditingColumnTitle(e.target.value)
                            }
                            onBlur={() => handleSaveColumnName(column.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveColumnName(column.id);
                              } else if (e.key === "Escape") {
                                setEditingColumnId(null); // Hủy edit khi bấm Esc
                              }
                            }}
                            autoFocus // Tự động focus vào input khi mở lên
                            className="h-8 text-sm font-semibold"
                          />
                        </div>
                      ) : (
                        <KanbanBoardColumnTitle
                          columnId={column.id}
                          className="pl-2 w-full select-none" // select-none để tránh bôi đen nhầm khi double click
                          onDoubleClick={() => startEditingColumn(column)}
                        >
                          {column.name}
                        </KanbanBoardColumnTitle>
                      )}
                    </KanbanBoardColumnHeader>

                    {/* Danh sách cards */}
                    <KanbanBoardColumnList>
                      {tasksToRender
                        .filter((task) => task.listId === column.id)
                        .map((task) => {
                          const totalItems =
                            task.checklists?.reduce(
                              (sum, cl) =>
                                sum + (cl.checklistItems?.length || 0),
                              0,
                            ) ?? 0;
                          const completedItems =
                            task.checklists?.reduce(
                              (sum, cl) =>
                                sum +
                                (cl.checklistItems?.filter((i) => i.completed)
                                  .length || 0),
                              0,
                            ) ?? 0;
                          return (
                            <KanbanBoardColumnListItem
                              key={task.id}
                              cardId={task.id}
                              onDropOverListItem={(data, direction) =>
                                handleDropOverListItem(task.id, data, direction)
                              }
                            >
                              <KanbanBoardCard
                                data={task}
                                onClick={() =>
                                  navigate(
                                    `/boards/${boardId}/cards/${task.id}`,
                                  )
                                }
                                className="relative"
                              >
                                {task.cardLabels &&
                                  task.cardLabels.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {task.cardLabels?.map(
                                        (cardLabel: any) => {
                                          const labelDetail = cardLabel?.label;
                                          if (!labelDetail) return null;

                                          return (
                                            <span
                                              key={labelDetail.id}
                                              className="inline-block px-2 text-[10px] font-semibold text-white rounded-full"
                                              style={{
                                                backgroundColor:
                                                  labelDetail.color,
                                              }}
                                            >
                                              {labelDetail.name}
                                            </span>
                                          );
                                        },
                                      )}
                                    </div>
                                  )}
                                <KanbanBoardCardTitle>
                                  {task.title}
                                </KanbanBoardCardTitle>

                                <div className="flex justify-between items-center gap-2">
                                  <div className="flex gap-4 items-center text-xs">
                                    <div className="flex items-center gap-1">
                                      <MessageSquareText className="w-4" />
                                      {task.commentsCount || 0}
                                    </div>

                                    {totalItems > 0 && (
                                      <div className="flex items-center gap-1">
                                        <SquareCheck
                                          className="w-4 "
                                          color={
                                            completedItems === totalItems
                                              ? "green"
                                              : "gray"
                                          }
                                        />
                                        <div className="flex items-center gap-1">
                                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full rounded-full transition-all ${
                                                completedItems === totalItems
                                                  ? "bg-green-500"
                                                  : "bg-blue-400"
                                              }`}
                                              style={{
                                                width: `${(completedItems / totalItems) * 100}%`,
                                              }}
                                            />
                                          </div>
                                          <span
                                            className={`text-xs font-medium ${
                                              completedItems === totalItems
                                                ? "text-green-600"
                                                : "text-muted-foreground"
                                            }`}
                                          >
                                            {completedItems}/{totalItems}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    {task.cardMembers &&
                                      task.cardMembers.length > 0 && (
                                        <AvatarGroup className="grayscale">
                                          {/* 2. Map over the members INSIDE the AvatarGroup */}
                                          {task.cardMembers.map(
                                            (cardMember: any) => {
                                              const memberDetail =
                                                cardMember?.user;
                                              if (!memberDetail) return null;

                                              return (
                                                // 3. Always provide a unique 'key' when rendering elements in a list
                                                <Avatar key={memberDetail.id}>
                                                  <AvatarImage
                                                    // Use the actual user's avatar URL from your data
                                                    src={
                                                      memberDetail.avatar || ""
                                                    }
                                                    alt={`@${memberDetail.name}`}
                                                  />
                                                  <AvatarFallback>
                                                    {memberDetail.name
                                                      ? memberDetail.name
                                                          .charAt(0)
                                                          .toUpperCase()
                                                      : "?"}
                                                  </AvatarFallback>
                                                </Avatar>
                                              );
                                            },
                                          )}
                                        </AvatarGroup>
                                      )}
                                  </div>
                                </div>
                              </KanbanBoardCard>
                            </KanbanBoardColumnListItem>
                          );
                        })}
                    </KanbanBoardColumnList>

                    {/* Footer để thêm card mới */}
                    <KanbanBoardColumnFooter>
                      <CreateCard
                        listId={column.id}
                        onCardCreated={createCard}
                      />
                    </KanbanBoardColumnFooter>
                  </KanbanBoardColumn>
                </div>
              ))}

              <CreateList
                boardId={boardId}
                createList={createList}
                loading={listsLoading}
              />
            </KanbanBoard>
          </div>
        </KanbanBoardProvider>
        {/* Outlet để render nested routes (CardDetail modal) */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
