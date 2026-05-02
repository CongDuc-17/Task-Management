import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  roleName: string;
  boardsCount: number;
  membersCount: number;
  boards?: Board[];
}

interface Board {
  id: string;
  name: string;
  status: string;
  background?: string;
  projectId: string;
}

type ArchivedProps = {
  projects: Project[];
  boards: Board[];
  handleRestoreProject: (projectId: string) => void;
  handleDeleteProject: (projectId: string) => void;
  handleRestoreBoard: (boardId: string) => void;
  handleDeleteBoard: (boardId: string) => void;
};
export function Archived({
  projects,
  boards,
  handleRestoreProject,
  handleDeleteProject,
  handleRestoreBoard,
  handleDeleteBoard,
}: ArchivedProps) {
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onDeleteConfirm = async () => {
    if (boardToDelete) {
      await handleDeleteBoard(boardToDelete);
      setIsAlertOpen(false);
      setBoardToDelete(null);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Archived Items</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Archived Items</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="projects">
                Projects
                <Badge variant="outline" className="ml-2">
                  {projects.filter((p) => p.status === "ARCHIVED").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="boards">
                Boards
                <Badge variant="outline" className="ml-2">
                  {boards.filter((b) => b.status === "ARCHIVED").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <CardTitle>{project.name}</CardTitle>
                        <Badge>{project.boardsCount} boards</Badge>
                        <Badge variant="outline">
                          {project.membersCount} members
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <div className="flex gap-2 pr-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ArchiveRestore
                            className="hover:cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => handleRestoreProject(project.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Restore Project</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="hover:cursor-pointer hover:text-[#ff0000] transition-colors"
                            onClick={() => handleDeleteProject(project.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Project</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <TabsContent value="boards">
                <div className="grid grid-cols-2 gap-6 pr-8">
                  {boards.map(
                    (board) =>
                      board.status === "ARCHIVED" && (
                        <Card
                          key={board.id}
                          className="h-36 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
                          style={
                            board.background
                              ? {
                                  backgroundImage: `url(${board.background})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }
                              : { backgroundColor: "#f3f4f6" }
                          }
                        >
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                          <div className="absolute bottom-0 w-full text-left p-2 bg-white/90 backdrop-blur-sm font-medium border-t flex justify-between items-center">
                            {board.name}
                            <div className="flex gap-2 ">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ArchiveRestore
                                    className="hover:cursor-pointer hover:text-blue-500 transition-colors"
                                    onClick={() => handleRestoreBoard(board.id)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Restore Board</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Trash2
                                    className="hover:cursor-pointer hover:text-[#ff0000] transition-colors"
                                    onClick={() => {
                                      setBoardToDelete(board.id);
                                      setIsAlertOpen(true);
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Board</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </Card>
                      ),
                  )}
                </div>
              </TabsContent>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the board and all of its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={onDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Tabs>
        </DialogContent>
      </form>
    </Dialog>
  );
}
