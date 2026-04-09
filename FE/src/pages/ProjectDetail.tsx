import { CreateBoard } from "@/components/boards/CreateBoard";
import { AppSidebar } from "@/components/layout/SideBar";
import { HeaderProject } from "@/components/projects/HeaderProject";
import { Card } from "@/components/ui/card";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useProjects } from "@/hooks/useProjects";
import { Link, useParams } from "react-router-dom";

export function ProjectDetail() {
  const projectId = useParams().projectId as string;
  const { getProjectBoards, loading, error, getProjectById } = useProjects();

  const project = getProjectById(projectId);
  console.log("ProjectDetail - project:", project);
  const boards = getProjectBoards(projectId);

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="relative">
        <HeaderProject projectId={projectId} projectName={project?.name} />
        <main className="">
          <div className="grid grid-cols-4 gap-6 p-8">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            {!loading &&
              !error &&
              boards.map((b) => (
                <Link to={`/boards/${b.id}`} key={b.id}>
                  <Card className="h-36 cursor-pointer hover:shadow-lg transition-shadow relative">
                    <div className="absolute bottom-0 w-full text-center p-2 bg-gray-100 rounded-b-lg font-medium">
                      {b.name}
                    </div>
                  </Card>
                </Link>
              ))}

            <CreateBoard projectId={projectId} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
