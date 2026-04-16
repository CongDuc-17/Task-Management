import { CreateProject } from "@/components/projects/CreateProject";
import { Card } from "@/components/ui/card";

import { useProjects } from "@/hooks/useProjects";

import { Trello, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateBoard } from "@/components/boards/CreateBoard";
export function Dashboard() {
  const { projects, loading, error } = useProjects();

  return (
    <>
      <div className="sticky top-0 z-10 shadow-md flex justify-between items-center px-4 py-2">
        <h1 className="text-2xl font-bold p-4 ">Dashboard</h1>

        <hr />
      </div>
      <main className=" h-screen overflow-y-auto">
        <div className="p-8 flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">Dashboard</div>
            <div>
              Welcome to the Dashboard! Here you can manage your projects and
              tasks efficiently.
            </div>
          </div>

          <div>
            <CreateProject />
          </div>
        </div>

        <div className="pl-8 ">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}

          {!loading && !error && projects.length === 0 && (
            <div>No projects found.</div>
          )}

          {!loading &&
            !error &&
            projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mr-8">
                  <div>
                    <Link to={`/projects/${project.id}`}>
                      <div className="text-2xl font-medium mb-2 flex items-center gap-2">
                        <Trello />
                        {project.name}
                      </div>
                    </Link>
                    <div className="text-md text-gray-600 mb-6 flex items-center gap-2">
                      {project.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <EllipsisVertical />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 pr-8 pb-8">
                  {project.boards?.map((b) => (
                    <Link to={`/boards/${b.id}`} key={b.id}>
                      <Card className="h-36 cursor-pointer hover:shadow-lg transition-shadow relative">
                        <div className="absolute bottom-0 w-full text-center p-2 bg-gray-100 rounded-b-lg font-medium">
                          {b.name}
                        </div>
                      </Card>
                    </Link>
                  ))}
                  <CreateBoard projectId={project.id} />
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
