import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { Label } from "../ui/label";

type ArchiveCard = {
  id: string;
  title: string;
  [key: string]: any;
};

type ArchiveList = {
  id: string;
  name: string;
  [key: string]: any;
};

export type ArchivePopoverProps = {
  savedCards: ArchiveCard[];
  savedLists: ArchiveList[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onRestoreCard: (card: ArchiveCard) => void;
  onDeleteCard: (card: ArchiveCard) => void;
  onRestoreList: (list: ArchiveList) => void;
  onDeleteList: (list: ArchiveList) => void;
};

export function ArchivePopover({
  savedCards,
  savedLists,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onRestoreCard,
  onDeleteCard,
  onRestoreList,
  onDeleteList,
}: ArchivePopoverProps) {
  const totalCount = savedCards.length + savedLists.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Drag-drop wrapper — expands on hover while dragging */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative flex items-center justify-center cursor-pointer select-none
            rounded-full border-2 shadow-lg transition-all duration-200
            ${
              isDragOver
                ? "w-22 h-22 bg-black/20 backdrop-blur-sm order-black shadow-black scale-110"
                : "w-15 h-15 bg-white/80 backdrop-blur-sm border-transparent hover:bg-white"
            }
          `}
          title="Archive"
        >
          <Archive
            className={`transition-all duration-200 pointer-events-none ${
              isDragOver ? "w-10 h-10 text-black" : "w-6 h-6 text-gray-600"
            }`}
          />
          {totalCount > 0 && !isDragOver && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold pointer-events-none">
              {totalCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        className="w-80 max-h-[420px] overflow-y-auto"
      >
        <Label className="pb-2">Archived Items</Label>
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">
              Cards
              {savedCards.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px] font-bold">
                  {savedCards.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="lists">
              Lists
              {savedLists.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px] font-bold">
                  {savedLists.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Cards tab */}
          <TabsContent value="cards" className="flex flex-col gap-2 mt-2">
            {savedCards.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                No cards in archive yet
              </p>
            ) : (
              savedCards.map((card) => (
                <Card
                  key={card.id}
                  className="p-2 w-full flex flex-row items-center justify-between gap-2"
                >
                  <span className="text-sm truncate flex-1">{card.title}</span>
                  <div className="flex gap-2 shrink-0">
                    <ArchiveRestore
                      className="hover:cursor-pointer hover:text-blue-500 transition-colors"
                      onClick={() => onRestoreCard(card)}
                    />
                    <Trash2
                      className="hover:cursor-pointer hover:text-[#ff0000] transition-colors"
                      onClick={() => onDeleteCard(card)}
                    />
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Lists tab */}
          <TabsContent value="lists" className="flex flex-col gap-2 mt-2">
            {savedLists.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                No lists in archive yet
              </p>
            ) : (
              savedLists.map((list) => (
                <Card
                  key={list.id}
                  className="p-2 w-full flex flex-row items-center justify-between gap-2"
                >
                  <span className="text-sm truncate flex-1">{list.name}</span>
                  <div className="flex gap-2 shrink-0">
                    <ArchiveRestore
                      className="hover:cursor-pointer hover:text-blue-500 transition-colors"
                      onClick={() => onRestoreList(list)}
                    />
                    <Trash2
                      className="hover:cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => onDeleteList(list)}
                    />
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
