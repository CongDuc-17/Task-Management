import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
                      <AddMember membersCard={card.members} />
                    </AvatarGroupCount>
                  </AvatarGroup>
                ) : (
                  <AddMember membersCard={card.members} />
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
                {card.checklists?.map((checklist, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between ">
                      <div>{checklist.title}</div>
                      <Trash2 />
                    </div>
                    <Progress
                      value={
                        (checklist.completedCount / checklist.itemCount) * 100
                      }
                      className="mt-2 mb-2"
                    />

                    {checklist.checklistItems.map((item, indexItem) => (
                      <div>
                        <div
                          key={indexItem}
                          className="flex items-center gap-2 pl-4"
                        >
                          <Checkbox checked={item.completed} />
                          <span>{item.title}</span>
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
                          // onClick={() => {
                          //   // Add item logic here
                          //   setActiveChecklistId(null);
                          //   setInputValue("");
                          // }}
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
                ))}
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
