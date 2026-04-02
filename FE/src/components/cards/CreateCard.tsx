import { useState } from "react";
import { Plus, X } from "lucide-react";
import { KanbanBoardColumnButton } from "@/components/kanban";

export function CreateCard({
  listId,
  onCardCreated,
}: {
  listId: string;
  onCardCreated: (listId: string, title: string) => Promise<void>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateCard() {
    if (!title.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      await onCardCreated(listId, title);
      setTitle("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create card:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleCreateCard();
    } else if (e.key === "Escape") {
      setTitle("");
      setIsCreating(false);
    }
  }

  if (isCreating) {
    return (
      <div className="p-2 flex gap-2">
        <input
          type="text"
          placeholder="Enter title of the card..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        />
        <button
          onClick={handleCreateCard}
          disabled={!title.trim() || isLoading}
          className="px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu
        </button>
        <button
          onClick={() => {
            setTitle("");
            setIsCreating(false);
          }}
          disabled={isLoading}
          className="px-2 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <KanbanBoardColumnButton onClick={() => setIsCreating(true)}>
      <Plus className="size-4 mr-2" />
      Add Card
    </KanbanBoardColumnButton>
  );
}
