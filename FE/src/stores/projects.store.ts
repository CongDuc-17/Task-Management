import { create } from "zustand";
interface Project {
  id: string;
  name: string;
  description?: string;
  members?: Member[];

  boards?: Board[];
}

interface Board {
  id: string;
  name: string;
  description?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  roleId: string;
}

interface ProjectsStore {
  projects: Project[];
  loading: boolean;
  error: Error | null | string;

  setProjects: (projects: Project[]) => void;
  createProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;

  createBoardToProject: (projectId: string, board: Board) => void;

  updateMembersCount: (projectId: string, count: number) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: Error | null | string) => void;
}

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  setProjects: (projects) => set({ projects, error: null }),
  createProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),

  createBoardToProject: (projectId, board) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, boards: p.boards ? [...p.boards, board] : [board] }
          : p,
      ),
    })),

  updateMembersCount: (projectId, count) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, membersCount: count } : p,
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
