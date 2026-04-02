import { EllipsisVertical } from "lucide-react";
import { Members } from "../Members";

export function HeaderProject({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName?: string;
}) {
  return (
    <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
      <div className="text-2xl font-bold p-4">{projectName}</div>
      <div className="flex items-center gap-4">
        <Members />
        <EllipsisVertical />
      </div>
    </div>
  );
}
