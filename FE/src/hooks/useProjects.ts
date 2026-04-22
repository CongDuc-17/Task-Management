import { apiClient } from "@/lib/apiClient";
import { useProjectsStore } from "@/stores/projects.store";
import { useEffect } from "react";

export const useProjects = () => {
  const { projects, setProjects, loading, setLoading, error, setError } =
    useProjectsStore();

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await apiClient.get("/projects");

      setProjects(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch projects", error);
      setError(error);
    }
  }

  async function createProject(data: { name: string; description?: string }) {
    try {
      setLoading(true);
      console.log("Creating project with data:", data);
      const response = await apiClient.post("/projects", data);
      await fetchProjects();
      console.log("Created project:", response.data);
    } catch (error) {
      console.error("Failed to create project", error);
      setError(error);
    }
  }

  // Helper function to get boards for a specific project from store
  const getProjectBoards = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.boards || [];
  };

  const getProjectById = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    getProjectBoards,
    getProjectById,
    fetchProjects,
  };
};
