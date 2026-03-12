import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useProjectsStore } from "@/stores/projects.store";
import { useParams } from "react-router-dom";
type Board = {
  id: string;
  name: string;
  description?: string;
};

export const useBoards = () => {
  const boardId = useParams().boardId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState<Board | null>(null);

  const { createBoardToProject } = useProjectsStore();

  async function createBoard(
    projectId: string,
    data: { name: string; description?: string },
  ) {
    try {
      setLoading(true);
      console.log("Creating board with data:", data);
      const response = await apiClient.post(
        `/projects/${projectId}/boards`,
        data,
      );
      console.log("Created board:", response.data);
      createBoardToProject(projectId, response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Failed to create board", error);
      setLoading(false);
      setError(error);
    }
  }

  async function fetchBoard() {
    if (!boardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/boards/${boardId}`);
      const boardData = (response as { data?: unknown }).data ?? response;

      if (boardData && typeof boardData === "object") {
        setBoard(boardData as Board);
      }
      setError(null);
    } catch (error) {
      console.error("Failed to fetch board", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  return { loading, error, board, createBoard, fetchBoard };
};
