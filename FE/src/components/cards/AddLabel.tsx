import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Plus, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";

export function AddLabel({
  labelsBoard,
  labelsCard,
  fetchLabelsBoard,
  onUpdateLabels,
}: {
  labelsBoard: any[];
  labelsCard: string[];
  fetchLabelsBoard: () => void;
  onUpdateLabels: (action: "add" | "remove", labelObj: any) => void;
}) {
  const boardId = useParams().boardId as string;

  const { cardId } = useParams();

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [labelInputPopoverOpen, setLabelInputPopoverOpen] = useState(false);

  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [editingLabel, setEditingLabel] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

  const DEFAULT_LABEL_COLORS = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#a855f7",
    "#f97316",
  ];

  // Kiểm tra label card nào có thì tick chọn
  useEffect(() => {
    if (labelsCard && labelsBoard) {
      const labelCardIds = labelsCard.map((label) => label.id);
      const labelBoardIds = labelsBoard.map((label) => label.id);
      const selected = labelBoardIds.filter((id) => labelCardIds.includes(id));
      setSelectedLabels(selected);
    }
  }, [labelsCard, labelsBoard]);

  const handleLabelToggle = async (labelColor: string, labelId: string) => {
    const isSelected = selectedLabels.includes(labelId);

    const fullLabelObj = labelsBoard.find((l) => l.id === labelId);

    setSelectedLabels((prev) =>
      isSelected ? prev.filter((id) => id !== labelId) : [...prev, labelId],
    );

    try {
      if (isSelected) {
        const response = await apiClient.delete(
          `/cards/${cardId}/labels/${labelId}`,
        );
        onUpdateLabels("remove", fullLabelObj);
      } else {
        const response = await apiClient.post(`/cards/${cardId}/labels`, {
          labelId: labelId,
        });
        onUpdateLabels("add", fullLabelObj);
      }
    } catch (error) {
      console.error("Error toggling label:", error);
    }
  };

  async function handleAddLabel(label: {
    id: string;
    name: string;
    color: string;
  }) {
    handleLabelToggle(label.color, label.id);
  }

  const handleSaveLabel = async () => {
    if (!labelName.trim() || !selectedColor) return;

    try {
      if (editingLabel) {
        await apiClient.patch(`/labels/${editingLabel.id}`, {
          name: labelName,
          color: selectedColor,
        });
      } else {
        const response = await apiClient.post(`/boards/${boardId}/labels`, {
          name: labelName,
          color: selectedColor,
        });

        await apiClient.post(`/cards/${cardId}/labels`, {
          labelId: response.data.id,
        });

        onUpdateLabels("add", response.data);
      }

      fetchLabelsBoard();

      // Reset popover
      setLabelInputPopoverOpen(false);
      setLabelName("");
      setSelectedColor("");
      setEditingLabel(null);
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const handleUpdateLabel = (label: {
    id: string;
    name: string;
    color: string;
  }) => {
    setEditingLabel(label);
    setLabelName(label.name);
    setSelectedColor(label.color);
    setLabelInputPopoverOpen(true);
  };

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        // Không đóng popover cha nếu popover con đang mở
        if (labelInputPopoverOpen) {
          return;
        }
        setPopoverOpen(open);
      }}
    >
      <div className="flex items-center flex-wrap gap-0.5">
        {labelsCard.map((label, index) => (
          <div key={index} className="flex items-center gap-2 ">
            <Card
              key={index}
              className={`p-4  h-10  flex  items-start justify-center gap-2 cursor-pointer`}
              style={{ backgroundColor: label.color }}
            >
              <CardTitle className="text-sm  text-white">
                {label.name}
              </CardTitle>
            </Card>
          </div>
        ))}
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Plus />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-80 ">
        <div className="grid gap-4 relative">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Add Label</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label>Search for a label to add</Label>
              <Input id="label-search" name="label-search" type="text" />
            </div>

            {labelsBoard.length > 0 ? (
              <div>
                <div className="grid grid-cols gap-2 max-h-56 overflow-y-auto">
                  {labelsBoard.map((label, index) => (
                    <div key={index} className="flex items-center gap-2 ">
                      <Checkbox
                        id={`label-checkbox-${index}`}
                        name={`label-checkbox-${index}`}
                        checked={selectedLabels.includes(label.id)}
                        onCheckedChange={() =>
                          handleLabelToggle(label.color, label.id)
                        }
                      />
                      <Card
                        key={index}
                        className={`p-4 w-full h-10  flex  items-start justify-center gap-2 cursor-pointer`}
                        style={{ backgroundColor: label.color }}
                        onClick={() => handleAddLabel(label)}
                      >
                        <CardTitle className="text-sm  text-white">
                          {label.name}
                        </CardTitle>
                      </Card>
                      <SquarePen onClick={() => handleUpdateLabel(label)} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPopoverOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingLabel(null);
                      setLabelInputPopoverOpen(true);
                      setSelectedColor("");
                      setLabelName("");
                    }}
                  >
                    Create new label
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setPopoverOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setEditingLabel(null);
                    setLabelInputPopoverOpen(true);
                    setSelectedColor("");
                    setLabelName("");
                  }}
                >
                  Create new label
                </Button>
              </div>
            )}
          </div>

          {/* Label Input Popover */}
          <Popover
            open={labelInputPopoverOpen}
            onOpenChange={(open) => {
              if (!open) {
                setEditingLabel(null);
                setLabelName("");
                setSelectedColor("");
              }
              setLabelInputPopoverOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <div className="absolute bottom-0 right-0 w-[1px] h-full opacity-0 pointer-events-none" />
            </PopoverTrigger>
            <PopoverContent
              className="w-64"
              side="right"
              align="center"
              sideOffset={17}
            >
              <div className="grid gap-4">
                <div className="space-y-2">
                  {editingLabel ? (
                    <div>
                      <h4 className="leading-none font-medium">
                        Edit label "{editingLabel.name}"
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Choose a color and enter a new name
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="leading-none font-medium">
                        Create new label
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Choose a color and enter a name
                      </p>
                    </div>
                  )}
                </div>

                {/* Hiển thị các màu sắc */}
                <div>
                  <Label className="text-sm mb-2">Select color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {DEFAULT_LABEL_COLORS.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded cursor-pointer border-2 transition-all ${
                          selectedColor === color
                            ? "border-gray-800 scale-110"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="label-name">Label Name</Label>
                  <Input
                    id="label-name"
                    placeholder="Enter label name..."
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveLabel();
                      }
                    }}
                  />
                </div>

                {selectedColor && (
                  <div
                    className="h-10 rounded flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: selectedColor }}
                  >
                    Preview
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLabelInputPopoverOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveLabel}
                    disabled={!labelName.trim() || !selectedColor}
                    className="flex-1"
                  >
                    {editingLabel ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
}
