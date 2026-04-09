import { EllipsisVertical } from "lucide-react";

import { MembersProject } from "./MembersProject";

export function HeaderProject({
  projectId,
  projectName,
  projectMembers,
}: {
  projectId: string;
  projectName?: string;
  projectMembers?: string[];
}) {
  console.log("HeaderProject - projectMembers:", projectMembers);

  return (
    <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
      <div className="text-2xl font-bold p-4">{projectName}</div>
      <div className="flex items-center gap-4">
        {/* avatars */}

        <MembersProject projectMembers={projectMembers} />

        <EllipsisVertical />
      </div>
    </div>
  );
}
