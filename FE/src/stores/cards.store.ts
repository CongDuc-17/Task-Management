import { create } from "zustand";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface CardLabel {
  id: string;
  cardId: string;
  labelId: string;
  label: Label; // Object lồng nhau do Prisma include
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface CardMember {
  id: string;
  cardId: string;
  userId: string;
  user: User; // Object lồng nhau
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  createdAt?: string;
  checklistItems: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description?: string | null;
  listId: string;
  position: number;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  cardLabels?: CardLabel[];
  cardMembers?: CardMember[];
  checklists?: Checklist[];
  commentsCount?: number;
}

interface CardsStore {
  cards: Card[];
  currentCardId: string | null;
  loading: boolean;
  error: Error | null | string;

  setCards: (cards: Card[]) => void;
  setCurrentCardId: (cardId: string | null) => void;
  getCurrentCard: () => Card | undefined;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: Error | null | string) => void;

  // Optimistic UI Actions
  addLabel: (cardId: string, label: Label) => void;
  removeLabel: (cardId: string, labelId: string) => void;

  addMember: (cardId: string, user: User) => void;
  removeMember: (cardId: string, userId: string) => void;

  addChecklist: (cardId: string, checklist: Checklist) => void;
  removeChecklist: (cardId: string, checklistId: string) => void;
}

export const useCardsStore = create<CardsStore>((set, get) => ({
  cards: [],
  currentCardId: null,
  loading: false,
  error: null,

  setCards: (cards) => set({ cards, error: null }),
  setCurrentCardId: (cardId) => set({ currentCardId: cardId }),
  getCurrentCard: () => {
    const { cards, currentCardId } = get();
    return cards.find((c) => c.id === currentCardId);
  },
  createCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

  updateCard: (updatedCard) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === updatedCard.id ? { ...c, ...updatedCard } : c,
      ),
    })),
  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // --- LOGIC XỬ LÝ LỒNG NHAU (Khớp với Prisma Join Table) ---

  addLabel: (cardId, label) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              // Tự động fake object trung gian để UI ăn ngay
              cardLabels: [
                ...(card.cardLabels || []),
                {
                  id: `temp-${Date.now()}`,
                  cardId: cardId,
                  labelId: label.id,
                  label: label, // <--- Bọc label vào trong object
                },
              ],
            }
          : card,
      ),
    })),

  removeLabel: (cardId, labelIdToRemove) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              // Lọc theo ID của bản thân cái label (chứ không phải ID của bảng nối)
              cardLabels: card.cardLabels?.filter(
                (cl) =>
                  cl.labelId !== labelIdToRemove &&
                  cl.label?.id !== labelIdToRemove,
              ),
            }
          : card,
      ),
    })),

  addMember: (cardId, user) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              cardMembers: [
                ...(card.cardMembers || []),
                {
                  id: `temp-${Date.now()}`,
                  cardId: cardId,
                  userId: user.id,
                  user: user,
                },
              ],
            }
          : card,
      ),
    })),

  removeMember: (cardId, userIdToRemove) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              cardMembers: card.cardMembers?.filter(
                (m) =>
                  m.userId !== userIdToRemove && m.user?.id !== userIdToRemove,
              ),
            }
          : card,
      ),
    })),

  addChecklist: (cardId, checklist) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? { ...card, checklists: [...(card.checklists || []), checklist] }
          : card,
      ),
    })),

  removeChecklist: (cardId, checklistId) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              checklists: card.checklists?.filter((c) => c.id !== checklistId),
            }
          : card,
      ),
    })),
}));
