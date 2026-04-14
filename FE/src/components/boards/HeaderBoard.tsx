import { EllipsisVertical } from "lucide-react";

import { MembersBoard } from "./MembersBoard";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Input } from "../ui/input";

export function HeaderBoard({
  boardId,
  boardName,
  boardMembers,
  fetchBoard,
}: {
  boardId: string;
  boardName?: string;
  boardMembers: string[];
  fetchBoard: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(boardName || "");

  async function handleUpdateBoardName(name: string) {
    if (!name.trim()) {
      alert("Board name cannot be empty");
      return;
    }
    try {
      await apiClient.patch(`/boards/${boardId}`, { name: name });
      await fetchBoard();
    } catch (error) {
      console.error("Failed to update board name", error);
    } finally {
      setEditing(false);
    }
  }

  return (
    <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
      <div className=" p-4 text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 px-0">
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
        <EllipsisVertical />
      </div>
    </div>
  );
}
