import { PrismaService } from '../database';
export class CardsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async getAllCardsByListId(listId: string) {
		return this.prismaService.cards.findMany({
			where: { listId: listId },
			orderBy: { position: 'asc' },
		});
	}

	async getLastCardByListId(listId: string) {
		return this.prismaService.cards.findFirst({
			where: { listId: listId },
			orderBy: { position: 'desc' },
		});
	}

	async getCardById(cardId: string) {
		return this.prismaService.cards.findUnique({
			where: { id: cardId },
		});
	}

	async getCardInList(cardId: string, listId: string) {
		return this.prismaService.cards.findFirst({
			where: {
				id: cardId,
				listId: listId,
			},
		});
	}

	async createCard(title: string, listId: string, position: number) {
		return this.prismaService.cards.create({
			data: {
				title: title,
				listId: listId,
				position: position,
			},
		});
	}

	async updateCardPosition(targetListId: string, cardId: string, newPosition: number) {
		return this.prismaService.cards.update({
			where: {
				id: cardId,
			},
			data: {
				listId: targetListId,
				position: newPosition,
			},
		});
	}

	async updateInformationCard(
		cardId: string,
		data: {
			title?: string;
			description?: string;
			dueDate?: Date;
		},
	) {
		return this.prismaService.cards.update({
			where: { id: cardId },
			data: {
				title: data.title,
				description: data.description,
				dueDate: data.dueDate,
				updatedAt: new Date(),
			},
		});
	}

	async softDeleteCard(cardId: string) {
		return this.prismaService.cards.update({
			where: { id: cardId },
			data: { deletedAt: new Date() },
		});
	}

	async hardDeleteCard(cardId: string) {
		return this.prismaService.cards.delete({
			where: { id: cardId },
		});
	}

	// cardMember
	async addMemberToCard(cardId: string, userId: string[]) {
		if (userId.length === 0) return;
		return this.prismaService.cardMembers.createMany({
			data: userId.map((id) => ({ cardId: cardId, userId: id })),
			skipDuplicates: true,
		});
	}

	async removeMemberFromCard(cardId: string, userId: string[]) {
		if (userId.length === 0) return;
		return this.prismaService.cardMembers.deleteMany({
			where: {
				cardId: cardId,
				userId: { in: userId },
			},
		});
	}

	async getMembersInCard(cardId: string) {
		return this.prismaService.cardMembers.findMany({
			where: { cardId: cardId },
		});
	}
}
