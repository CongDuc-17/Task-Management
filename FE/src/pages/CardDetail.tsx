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
import { X } from "lucide-react";
import { AddChecklist } from "@/components/cards/AddChecklist";
import { AddMember } from "@/components/cards/AddMember";
import { AddLabel } from "@/components/cards/AddLabel";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
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

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const handleClose = () => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-9/12 top-3/12  transform -translate-x-1/2 -translate-y-1/2 max-w-none! bg-background rounded-lg shadow-md p-6 overflow-y-auto">
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
              <div className="flex flex-row flex-wrap items-center pr-4 gap-2">
                <AddMember membersCard={card.members} />
                <AddLabel />
                <AddChecklist />
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
