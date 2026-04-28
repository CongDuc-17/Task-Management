import { CreateBoard } from "@/components/boards/CreateBoard";

import { HeaderProject } from "@/components/projects/HeaderProject";
import { Card } from "@/components/ui/card";

import { useProjects } from "@/hooks/useProjects";
import { useProjectsStore } from "@/stores/projects.store";
import { Toaster } from "sonner";
import { Link, useParams } from "react-router-dom";

export function ProjectDetail() {
  const projectId = useParams().projectId as string;
  const { loading, error, getProjectById } = useProjects();
  const updateProject = useProjectsStore((state) => state.updateProject);

  const handleProjectUpdated = (
    projectId: string,
    data: { name?: string; members?: any[] },
  ) => {
    const project = getProjectById(projectId);
    if (project) {
      updateProject({
        ...project,
        ...(data.name && { name: data.name }),
        ...(data.members && { members: data.members }),
      });
    }
  };

  const boards = useProjectsStore((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    return project?.boards || [];
  });

  const project = getProjectById(projectId);

  return (
    <>
      <Toaster position="top-right" />
      <HeaderProject
        projectId={projectId}
        projectName={project?.name}
        projectMembers={project?.members}
        onProjectUpdated={handleProjectUpdated}
      />
      <main className="">
        <div className="grid grid-cols-4 gap-6 p-8">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}

          {!loading &&
            !error &&
            boards.map((b) => (
              <Link to={`/boards/${b.id}`} key={b.id}>
                <Card
                  className="h-36 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
                  style={
                    b.background
                      ? {
                          backgroundImage: `url(${b.background})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : { backgroundColor: "#f3f4f6" }
                  }
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                  <div className="absolute bottom-0 w-full text-center p-2 bg-white/90 backdrop-blur-sm font-medium border-t">
                    {b.name}
                  </div>
                </Card>
              </Link>
            ))}

          <CreateBoard projectId={projectId} />
        </div>
      </main>
    </>
  );
}
