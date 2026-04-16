import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import trelloLogo from "@/assets/Trello-Logo--Streamline-Logos.svg";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";

import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const { projects, loading, error } = useProjects();

  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" className="group/sidebar">
      <SidebarHeader className="relative">
        <Link to="/dashboard">
          <div className="flex items-center gap-2 px-4 py-3">
            <img src={trelloLogo} alt="Trello Logo" className="w-8 h-8" />
            <div className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              Trello
            </div>
          </div>
        </Link>
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 
                        opacity-1 group-hover/sidebar:opacity-100 
                        transition-opacity duration-200
                        "
        >
          <SidebarTrigger className="h-7 w-7" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 px-4 py-3">
            Navigation
          </SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 gap-2 ">
            <Folder color="black" size={46} />
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent className="pl-6 group-data-[collapsible=icon]:hidden">
            {loading && <div>Loading...</div>}
            {error && <div>Error: Failed to fetch projects</div>}

            {!loading && !error && projects.length === 0 && (
              <div>No projects found.</div>
            )}
            <Accordion type="single" collapsible>
              {!loading &&
                !error &&
                projects.map((project) => (
                  <AccordionItem value={project.id}>
                    <AccordionTrigger>{project.name}</AccordionTrigger>
                    <AccordionContent>
                      {project.boards?.map((board) => (
                        <Link to={`/boards/${board.id}`} key={board.id}>
                          <div className="py-1 pl-2 hover:bg-gray-200 rounded-md cursor-pointer">
                            {board.name}
                          </div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <hr />
          <div className="group-data-[collapsible=icon]:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-4 px-4 py-3 cursor-pointer ">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt="User Profile" />
                  </Avatar>
                  <div className="font-medium">{user?.name}</div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 left-0 ">
                <Link to="/me">
                  <Button
                    variant="ghost"
                    className="w-full border-none  flex justify-start items-center gap-2"
                  >
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full border-none flex justify-start items-center gap-2 "
                >
                  <span className="text-red-500">Sign Out</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
