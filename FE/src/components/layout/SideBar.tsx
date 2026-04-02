import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

import trelloLogo from "@/assets/Trello-Logo--Streamline-Logos.svg";
import profile from "@/assets/User-Circle--Streamline-Micro.png";
import exit from "@/assets/Exit--Streamline-Solar.svg";
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

export function AppSidebar() {
  const { projects, loading, error } = useProjects();

  return (
    <Sidebar>
      <Link to="/dashboard">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-3">
            <img src={trelloLogo} alt="Trello Logo" className="w-8 h-8" />
            <div className="font-semibold text-lg">Trello</div>
          </div>
        </SidebarHeader>
      </Link>

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

          <SidebarGroupContent className="pl-6">
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
          {/* <SidebarMenuItem>
              <SidebarMenuButton>Username</SidebarMenuButton>
            </SidebarMenuItem> */}
          <hr />
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-4 px-4 py-3 cursor-pointer ">
                <img
                  src={profile}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="font-medium">John Doe</div>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Button
                variant="ghost"
                className="w-full border-none mb-2 flex justify-start items-center gap-2"
              >
                <img
                  src={profile}
                  alt="User Profile"
                  className="w-6 h-6 rounded-full"
                />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full border-none mb-2 flex justify-start items-center gap-2 "
              >
                <img src={exit} alt="Exit Icon" />
                <span className="text-red-500">Sign Out</span>
              </Button>
            </PopoverContent>
          </Popover>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
