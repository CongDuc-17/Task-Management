import { useMemo, useState } from "react";

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
import { useCards } from "@/hooks/useCards";
import { CreateList } from "@/components/lists/CreateList";
import { CreateCard } from "@/components/cards/CreateCard";
import { HeaderBoard } from "@/components/boards/HeaderBoard";
import { useBoards } from "@/hooks/useBoards";
type List = {
  id: string;
  name: string;
  position: number;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
};

type Column = {
  id: string;
  name: string;
};

export function Board() {
  const boardId = useParams().boardId as string;
  const { board } = useBoards();
  console.log("Board data:", board); // Thêm log để kiểm tra dữ liệu board
  const { lists, createList, loading: listsLoading } = useLists(boardId);
  const listIds = useMemo(() => lists.map((list) => list.id), [lists]);
  const { cards, createCard } = useCards(listIds);
  const [columnOrder, setColumnOrder] = useState<string[] | null>(null);
  const baseColumns = useMemo<Column[]>(
    () =>
      [...lists]
        .sort((a: List, b: List) => a.position - b.position)
        .map((list: List) => ({
          id: list.id,
          name: list.name,
        })),
    [lists],
  );

  const columns = useMemo<Column[]>(() => {
    if (!columnOrder) {
      return baseColumns;
    }

    const columnsMap = new Map(
      baseColumns.map((column) => [column.id, column]),
    );
    const orderedColumns = columnOrder
      .map((columnId) => columnsMap.get(columnId))
      .filter((column): column is Column => Boolean(column));

    const missingColumns = baseColumns.filter(
      (column) => !columnOrder.includes(column.id),
    );

    return [...orderedColumns, ...missingColumns];
  }, [baseColumns, columnOrder]);

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const defaultTasks = useMemo<Task[]>(
    () =>
      cards.map((card) => ({
        id: card.id,
        title: card.title,
        columnId: card.listId,
      })),
    [cards],
  );

  const [tasks, setTasks] = useState<Task[]>([]);
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

  function handleColumnDrop(e: React.DragEvent, targetColumnId: string) {
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

    setColumnOrder((prevColumnOrder) => {
      const sourceColumns =
        prevColumnOrder?.length === columns.length
          ? prevColumnOrder
              .map((columnId) =>
                columns.find((column) => column.id === columnId),
              )
              .filter((column): column is Column => Boolean(column))
          : columns;

      const newColumns = [...sourceColumns];
      const draggedIndex = newColumns.findIndex(
        (col) => col.id === draggedColumnId,
      );
      const targetIndex = newColumns.findIndex(
        (col) => col.id === targetColumnId,
      );

      if (draggedIndex < 0 || targetIndex < 0) {
        return prevColumnOrder;
      }

      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);

      return newColumns.map((column) => column.id);
    });

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
  function handleDropOverColumn(columnId: string, data: string) {
    try {
      const taskData = JSON.parse(data) as Task;

      if (taskData.columnId === columnId) {
        return;
      }

      setTasks((prevTasks) =>
        (prevTasks.length ? prevTasks : defaultTasks).map((task) =>
          task.id === taskData.id ? { ...task, columnId } : task,
        ),
      );
    } catch (error) {
      console.error("Error parsing task data:", error);
    }
  }

  function handleDropOverListItem(
    targetCardId: string,
    data: string,
    direction: KanbanBoardDropDirection,
  ) {
    if (direction === "none") {
      return;
    }

    try {
      //const draggedTask = JSON.parse(data) as Task;
      const draggedTask = JSON.parse(data);
      if (draggedTask.id === targetCardId) {
        return;
      }

      setTasks((prevTasks) => {
        const currentTasks = prevTasks.length ? prevTasks : defaultTasks;
        const targetTask = currentTasks.find(
          (task) => task.id === targetCardId,
        );
        if (!targetTask) return prevTasks;

        const tasksWithoutDragged = currentTasks.filter(
          (task) => task.id !== draggedTask.id,
        );

        const updatedDraggedTask = {
          ...draggedTask,
          columnId: targetTask.columnId,
        };

        const targetIndex = tasksWithoutDragged.findIndex(
          (task) => task.id === targetCardId,
        );

        const insertIndex = direction === "top" ? targetIndex : targetIndex + 1;

        const newTasks = [
          ...tasksWithoutDragged.slice(0, insertIndex),
          updatedDraggedTask,
          ...tasksWithoutDragged.slice(insertIndex),
        ];

        return newTasks;
      });
    } catch (error) {
      console.error("Error parsing task data:", error);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden relative">
        <HeaderBoard boardId={boardId} boardName={board?.name} />
        <KanbanBoardProvider>
          <div className="h-screen p-4 pt-20">
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
                      draggable
                      onDragStart={(e) => handleColumnDragStart(e, column.id)}
                      onDragEnd={handleColumnDragEnd}
                      className="cursor-move"
                    >
                      <KanbanBoardColumnTitle
                        columnId={column.id}
                        className="pl-2"
                      >
                        {column.name}
                      </KanbanBoardColumnTitle>
                    </KanbanBoardColumnHeader>

                    {/* Danh sách cards */}
                    <KanbanBoardColumnList>
                      {tasksToRender
                        .filter((task) => task.columnId === column.id)
                        .map((task) => (
                          <KanbanBoardColumnListItem
                            key={task.id}
                            cardId={task.id}
                            onDropOverListItem={(data, direction) =>
                              handleDropOverListItem(task.id, data, direction)
                            }
                          >
                            <KanbanBoardCard data={task}>
                              <KanbanBoardCardTitle>
                                {task.title}
                              </KanbanBoardCardTitle>
                              {task.description && (
                                <KanbanBoardCardDescription>
                                  {task.description}
                                </KanbanBoardCardDescription>
                              )}
                            </KanbanBoardCard>
                          </KanbanBoardColumnListItem>
                        ))}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
