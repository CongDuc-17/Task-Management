import { EllipsisVertical } from "lucide-react";

import { MembersProject } from "./MembersProject";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Input } from "../ui/input";
import { useProjectsStore } from "@/stores/projects.store";

export function HeaderProject({ projectId }: { projectId: string }) {
  const projectName = useProjectsStore(
    (state) => state.projects.find((p) => p.id === projectId)?.name,
  );
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(projectName || "");

  const updateProjectName = useProjectsStore(
    (state) => state.updateProjectName,
  );

  async function handleUpdateProjectName(name: string) {
    if (!name.trim()) {
      alert("Board name cannot be empty");
      return;
    }
    try {
      updateProjectName(projectId, name);
      await apiClient.patch(`/projects/${projectId}`, { name: name });
    } catch (error) {
      console.error("Failed to update project name", error);
      updateProjectName(projectId, projectName || "");
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
              handleUpdateProjectName(newName);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
                handleUpdateProjectName(newName);
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
              setNewName(projectName || "");
            }}
          >
            {projectName}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* avatars */}

        <MembersProject projectId={projectId} />

        <EllipsisVertical />
      </div>
    </div>
  );
}
