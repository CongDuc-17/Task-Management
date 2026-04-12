import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, X } from "lucide-react";
import { AddChecklist } from "@/components/cards/AddChecklist";
import { AddMember } from "@/components/cards/AddMember";
import { AddLabel } from "@/components/cards/AddLabel";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import { Progress } from "@/components/ui/progress";
import { useBoards } from "@/hooks/useBoards";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  members: string[];
  labels?: string[];
  checklists?: string[];
}

export function CardDetail() {
  const { cardId, boardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [newComments, setComments] = useState("");
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
    null,
  );
  const [inputValue, setInputValue] = useState("");
  const [confirmDeleteChecklistId, setConfirmDeleteChecklistId] =
    useState(false);

  const { labelsBoard, fetchLabelsBoard } = useBoards();

  useEffect(() => {
    fetchLabelsBoard();
  }, [boardId]);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/cards/${cardId}?include=members,labels,checklists`,
      );
      setCard(response.data);
      console.log("Fetched card:", response.data);
    } catch (error) {
      console.error("Error fetching card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMembers = (action: "add" | "remove", memberObj: any) => {
    setCard((prevCard) => {
      if (!prevCard) return prevCard;
      let updatedMembers = prevCard.members ? [...prevCard.members] : [];

      if (action === "add") {
        updatedMembers.push(memberObj);
      } else if (action === "remove") {
        // Logic so sánh ID tùy thuộc vào cấu trúc backend trả về
        updatedMembers = updatedMembers.filter(
          (m: any) =>
            (m.userId || m.user?.id) !==
            (memberObj.userId || memberObj.user?.id),
        );
      }
      return { ...prevCard, members: updatedMembers };
    });
  };

  const handleUpdateLabels = (action: "add" | "remove", labelObj: any) => {
    setCard((prevCard) => {
      if (!prevCard) return prevCard;

      let updatedLabels = prevCard.labels ? [...prevCard.labels] : [];

      if (action === "add") {
        updatedLabels.push(labelObj);
      } else if (action === "remove") {
        updatedLabels = updatedLabels.filter((l: any) => l.id !== labelObj.id);
      }

      return { ...prevCard, labels: updatedLabels };
    });
  };

  const handleUpdateChecklist = (
    action: "add" | "remove",
    checklistObj: any,
  ) => {
    setCard((prevCard) => {
      if (!prevCard) return prevCard;
      let updatedChecklists = prevCard.checklists
        ? [...prevCard.checklists]
        : [];

      if (action === "add") {
        updatedChecklists.push(checklistObj);
      } else if (action === "remove") {
        updatedChecklists = updatedChecklists.filter(
          (c: any) => c.id !== checklistObj.id,
        );
      }
      return { ...prevCard, checklists: updatedChecklists };
    });
  };

  async function handleAddChecklistItem(checklistId: string) {
    try {
      const response = await apiClient.post(`/checklists/${checklistId}`, {
        title: inputValue,
      });

      setCard((prevCard) => {
        if (!prevCard) return prevCard;

        const updatedChecklists = prevCard.checklists.map((checklist: any) => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              checklistItems: [
                ...(checklist.checklistItems || []),
                response.data,
              ],
            };
          }
          return checklist;
        });

        return { ...prevCard, checklists: updatedChecklists };
      });

      setInputValue("");
      setActiveChecklistId(null);
      console.log("Checklist item added", response.data);
    } catch (error) {
      console.error("Error adding checklist item:", error);
    }
  }

  async function handleCompletedChecklistItem(
    checklistItemId: string,
    newCheckedState: boolean,
  ) {
    try {
      setCard((prevCard) => {
        if (!prevCard) return prevCard;

        const updatedChecklists = prevCard.checklists?.map((checklist: any) => {
          // Thêm ( || [] ) để tránh lỗi văng app nếu checklist rỗng
          const updatedItems = (checklist.checklistItems || []).map(
            (item: any) => {
              if (item.id === checklistItemId) {
                return { ...item, completed: newCheckedState }; // Dùng luôn state mới
              }
              return item;
            },
          );

          return {
            ...checklist,
            checklistItems: updatedItems,
            completedCount: updatedItems.filter((i: any) => i.completed).length,
          };
        });

        return { ...prevCard, checklists: updatedChecklists };
      });

      await apiClient.patch(`/checklist-items/${checklistItemId}`, {
        completed: newCheckedState,
      });
    } catch (error) {
      console.error("Error updating checklist item:", error);
      // Lưu ý: Nếu API lỗi, bạn có thể thiết kế thêm logic để setCard lùi lại trạng thái cũ
    }
  }

  async function handleDeleteChecklist(checklistId: string) {
    const previousCard = { ...card };
    setConfirmDeleteChecklistId(true);

    setCard((prevCard) => {
      if (!prevCard) return prevCard;
      return {
        ...prevCard,
        checklists: prevCard.checklists?.filter((c) => c.id !== checklistId),
      };
    });

    try {
      await apiClient.delete(`/checklists/${checklistId}`);
      console.log("Deleted checklist successfully");
    } catch (error) {
      console.error("Error deleting checklist:", error);
      setCard(previousCard as Card);
      alert("Xóa thất bại, vui lòng thử lại!");
    }
  }

  useEffect(() => {
    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const handleClose = () => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-9/12 max-w-none! left-1/2 !top-0 !translate-y-0 transform -translate-x-1/2 mt-16 max-h-[85vh] bg-background rounded-lg shadow-md p-6 ">
        {card && (
          <DialogHeader className="flex  justify-between">
            <DialogTitle className="text-xl font-bold">
              {card.title}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </DialogHeader>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading card details...</p>
          </div>
        ) : card ? (
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full flex flex-col gap-4 ">
              <div>
                <Label className="pb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Enter more description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center flex-wrap pr-4 gap-2">
                {card.members?.length > 0 ? (
                  <AvatarGroup className="grayscale">
                    {card.members.map((member, index) => (
                      <Avatar key={index}>
                        <AvatarImage
                          src={member.userAvatar}
                          alt={member.userAvatar}
                        />
                        <AvatarFallback>{member.userName}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>
                      <AddMember
                        membersCard={card.members}
                        onUpdateMembers={handleUpdateMembers}
                      />
                    </AvatarGroupCount>
                  </AvatarGroup>
                ) : (
                  <AddMember
                    membersCard={card.members}
                    onUpdateMembers={handleUpdateMembers}
                  />
                )}

                <AddLabel
                  labelsBoard={labelsBoard}
                  labelsCard={card.labels}
                  fetchLabelsBoard={fetchLabelsBoard}
                  onUpdateLabels={handleUpdateLabels}
                />

                <AddChecklist onUpdateChecklist={handleUpdateChecklist} />
              </div>

              {/* checklist */}
              <div className="overflow-y-auto max-h-[50vh] flex flex-col gap-4 ">
                {card.checklists?.map((checklist, index) => {
                  const totalItems = checklist.checklistItems?.length || 0;
                  const completedItems =
                    checklist.checklistItems?.filter((i: any) => i.completed)
                      .length || 0;
                  const progressPercent =
                    totalItems === 0
                      ? 0
                      : Math.round((completedItems / totalItems) * 100);
                  return (
                    <div
                      key={checklist.id || index}
                      className="border rounded p-4"
                    >
                      <div className="flex items-center justify-between ">
                        <div>{checklist.title}</div>

                        <Dialog>
                          <DialogTrigger>
                            <Trash2 className="cursor-pointer text-gray-400 hover:text-red-500 transition" />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-red-500">
                                Are you absolutely sure you want to delete this
                                checklist?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently{" "}
                                <span className="font-bold">
                                  delete the checklist {checklist.title} and all
                                  its items
                                </span>{" "}
                                and remove your data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              onClick={() =>
                                handleDeleteChecklist(checklist.id)
                              }
                              className="hover:bg-red-500 transition cursor-pointer"
                            >
                              I understand, delete checklist
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Progress value={progressPercent} className="mt-2 mb-2" />

                      {checklist?.checklistItems?.map((item, indexItem) => (
                        <div key={item.id || indexItem}>
                          <div className="flex items-center gap-2 pl-4">
                            <Checkbox
                              checked={item.completed || false}
                              onCheckedChange={(checked) =>
                                handleCompletedChecklistItem(
                                  item.id,
                                  checked as boolean,
                                )
                              }
                            />
                            <span
                              className={
                                item.completed
                                  ? "line-through text-gray-400"
                                  : ""
                              }
                            >
                              {item.title}
                            </span>
                          </div>
                        </div>
                      ))}
                      {activeChecklistId === checklist.id ? (
                        <div className="flex gap-2 p-2">
                          <Input
                            id="checklist-item"
                            name="checklist-item"
                            type="text"
                            placeholder="Add checklist item..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                          />
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              handleAddChecklistItem(checklist.id);
                            }}
                          >
                            Add
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveChecklistId(null);
                              setInputValue("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setActiveChecklistId(checklist.id)}
                          className=" mt-2"
                        >
                          Add Checklist Item
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 ">
              <div>
                <Label className="pb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Comments
                </Label>
                <Input
                  id="comments"
                  name="comments"
                  type="text"
                  onChange={(e) => {
                    setComments(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Card not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
