import { EllipsisVertical } from "lucide-react";

import { MembersBoard } from "./MembersBoard";

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
  return (
    <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
      <div className="text-2xl font-bold p-4">{boardName}</div>
      <div className="flex items-center gap-4">
        <MembersBoard boardMembers={boardMembers} fetchBoard={fetchBoard} />
        <EllipsisVertical />
      </div>
    </div>
  );
}
