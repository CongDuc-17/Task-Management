import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBoards } from "@/hooks/useBoards";
import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { Plus, X } from "lucide-react";
import { useCardsStore } from "@/stores/cards.store";
export function AddMember({ membersCard = [] }: { membersCard: any[] }) {
  const cardId = useParams().cardId as string;
  const { board, fetchBoard } = useBoards();
  const { addMember, removeMember } = useCardsStore();
  // Lấy list userId đã có trên card
  const cardMemberIds = membersCard.map(
    (member) => member.userId || member.user?.id,
  );
  console.log("Card members in AddMember component:", membersCard);
  async function handleAddMemberToCard(memberId: string) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/members`, {
        userId: memberId,
      });

      // Optimistic update
      const memberToAdd = board?.members?.find((m) => m.user.id === memberId);
      if (memberToAdd) {
        const newMember = {
          id: memberId,
          name: memberToAdd.user.name,
          avatar: memberToAdd.user.avatar,
        };

        addMember(cardId, newMember); // Cập nhật ngay trong store để UI phản hồi nhanh
      }
    } catch (error) {
      console.error("Error adding member to card:", error);
    }
  }

  async function handleRemoveMemberFromCard(memberId: string) {
    try {
      const response = await apiClient.delete(
        `/cards/${cardId}/members/${memberId}`,
      );

      // onUpdateMembers("remove", { userId: memberId });
      removeMember(cardId, memberId); // Cập nhật ngay trong store để UI phản hồi nhanh
    } catch (error) {
      console.error("Error removing member from card:", error);
    }
  }

  useEffect(() => {
    fetchBoard();
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src="" alt="@shadcn" className="grayscale" />
          <AvatarFallback>
            <Plus />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Add Member</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Search for a member to add</Label>
            <Input id="member-search" name="member-search" type="text" />
          </div>

          <div className="flex flex-col gap-2  overflow-y-scroll   max-h-60">
            <div className="text-sm text-muted-foreground">Member of card</div>
            {membersCard?.map((member, index) => (
              <Button
                variant={"outline"}
                className="flex justify-between h-auto items-center hover:bg-white"
                key={member.userId || member.user.id || index}
              >
                <div className="flex items-center r gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 justify-center flex items-center ">
                    {member.userName ||
                      member.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>{member.user?.name}</div>
                </div>

                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveMemberFromCard(
                      member.userId || member.user?.id,
                    );
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <X size={16} />
                </Button>
              </Button>
            ))}
            <div className="text-sm text-muted-foreground">Member of board</div>
            {board?.members
              ?.filter((member) => !cardMemberIds.includes(member.user.id))
              .map((member, index) => (
                <Button
                  variant={"outline"}
                  className="flex justify-start h-auto items-center "
                  key={index}
                  onClick={() => handleAddMemberToCard(member.user.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 justify-center flex items-center ">
                      {member.userName ||
                        member.user?.name.charAt(0).toUpperCase()}
                    </div>

                    <div>{member.user.name}</div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
