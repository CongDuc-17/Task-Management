import { EllipsisVertical } from "lucide-react";

import { MembersBoard } from "./MembersBoard";
import { useRef, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function HeaderBoard({
  boardId,
  boardName,
  boardMembers,

  fetchBoard,
  onPreviewBackground,
}: {
  boardId: string;
  boardName?: string;
  boardMembers: string[];

  fetchBoard: () => Promise<void>;
  onPreviewBackground?: (url: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(boardName || "");
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  async function handleUpdateBoardName(name: string) {
    if (!name.trim()) {
      toast.error("Board name cannot be empty");
      return;
    }
    try {
      await apiClient.patch(`/boards/${boardId}`, { name: name });
      await fetchBoard();
    } catch (error) {
      toast.error("Failed to update board name");
      console.error("Failed to update board name", error);
    } finally {
      setEditing(false);
    }
  }

  async function handleArchiveBoard() {
    try {
      await apiClient.patch(`/boards/${boardId}/archive`);
      await fetchBoard();
      toast.success("Board archived successfully");
    } catch (error) {
      toast.error("Failed to archive board");
      console.error("Failed to archive board", error);
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      // Tạo URL tạm thời để hiển thị ảnh ngay lập tức
      const objectUrl = URL.createObjectURL(file);
      if (onPreviewBackground) {
        onPreviewBackground(objectUrl);
      }
      const formData = new FormData();
      formData.append("background", file);
      try {
        toast.info("Uploading background...");
        await apiClient.post(`/boards/${boardId}/background`, formData);
        await fetchBoard();
        toast.success("Background updated successfully");
      } catch (error) {
        toast.error("Failed to update background");
        console.error("Failed to update background", error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
      <div className="p-4 text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 px-0">
        {editing ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => {
              setEditing(false);
              handleUpdateBoardName(newName);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
                handleUpdateBoardName(newName);
              }
            }}
            autoFocus
            className="text-2xl font-bold p-4"
          />
        ) : (
          <div
            className="text-2xl font-bold cursor-text hover:bg-gray-100 rounded px-2 py-1 transition-colors"
            onDoubleClick={() => {
              setEditing(true);
              setNewName(boardName || "");
            }}
          >
            {boardName}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <MembersBoard boardMembers={boardMembers} fetchBoard={fetchBoard} />

        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="size-5 cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-50" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div onClick={() => fileInputRef.current?.click()}>
                    Change background
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Archive this board</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will archive the board. You can restore it later
                from the archive settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={handleArchiveBoard}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
