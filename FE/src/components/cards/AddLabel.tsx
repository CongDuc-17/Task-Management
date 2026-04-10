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
import { SquarePen } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";

export function AddLabel({
  labelsBoard,
  labelsCard,
}: {
  labelsBoard: any[];
  labelsCard: string[];
}) {
  const boardId = useParams().boardId as string;
  console.log("Labels from board:", labelsBoard);
  console.log("Labels of card:", labelsCard);
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
    console.log("Toggling label:", labelColor, "with ID:", labelId);
    console.log("cardId:", cardId);

    const isSelected = selectedLabels.includes(labelId);

    setSelectedLabels((prev) =>
      isSelected ? prev.filter((id) => id !== labelId) : [...prev, labelId],
    );

    try {
      if (isSelected) {
        // Xóa label nếu đã được chọn
        const response = await apiClient.delete(
          `/cards/${cardId}/labels/${labelId}`,
        );
        console.log("Removed label from card:", response.data);
      } else {
        // Thêm label nếu chưa được chọn
        const response = await apiClient.post(`/cards/${cardId}/labels`, {
          labelId: labelId,
        });
        console.log("Added label to card:", response.data);
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

  const handleCreateLabel = async () => {
    console.log(
      "Creating label with name:",
      labelName,
      "and color:",
      selectedColor,
    );
    if (!labelName.trim() || !selectedColor) return;

    try {
      const response = await apiClient.post(`/boards/${boardId}/labels`, {
        name: labelName,
        color: selectedColor,
      });

      const cardResponse = await apiClient.post(`/cards/${cardId}/labels`, {
        labelId: response.data.id,
      });

      // Cập nhật selectedLabels
      setSelectedLabels((prev) => [...prev, response.data.id]);

      // Reset popover
      setLabelInputPopoverOpen(false);
      setLabelName("");
      setSelectedColor("");
      setEditingLabel(null);
    } catch (error) {
      console.error("Error creating label:", error);
    }
  };

  return (
    <div>
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
        <PopoverTrigger asChild>
          <Button variant="outline">Add Label</Button>
        </PopoverTrigger>
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
                        <SquarePen />
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setLabelInputPopoverOpen(true);
                      setSelectedColor("");
                      setLabelName("");
                    }}
                    className="mt-2"
                  >
                    Create new label
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLabelInputPopoverOpen(true);
                    setSelectedColor("");
                    setLabelName("");
                  }}
                  className="mt-2"
                >
                  Create new label
                </Button>
              )}
            </div>
            {/* Label Input Popover */}
            <Popover
              open={labelInputPopoverOpen}
              onOpenChange={setLabelInputPopoverOpen}
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
                    <h4 className="leading-none font-medium">
                      Create new label
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Choose a color and enter a name
                    </p>
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
                          handleCreateLabel();
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
                      onClick={handleCreateLabel}
                      disabled={!labelName.trim() || !selectedColor}
                      className="flex-1"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
