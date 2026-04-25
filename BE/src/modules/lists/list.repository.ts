import { ListStatusEnum } from '@prisma/client';
import { PrismaService } from '../database';

export class ListsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async getAllListsByBoardId(boardId: string) {
		return this.prismaService.lists.findMany({
			where: { boardId: boardId, deletedAt: null },
		});
	}

	async getLastListByBoardId(boardId: string) {
		return this.prismaService.lists.findFirst({
			where: { boardId: boardId, deletedAt: null },
			orderBy: { position: 'desc' },
		});
	}

	async createList(nameList: string, boardId: string, position: number) {
		return this.prismaService.lists.create({
			data: {
				name: nameList,
				boardId: boardId,
				position: position,
			},
		});
	}

	async updateListName(listId: string, nameList: string) {
		return this.prismaService.lists.update({
			where: { id: listId },
			data: { name: nameList },
		});
	}

	async getListById(listId: string) {
		return this.prismaService.lists.findUnique({
			where: { id: listId },
		});
	}

	async updateListPosition(listId: string, newPosition: number) {
		return this.prismaService.lists.update({
			where: { id: listId },
			data: { position: newPosition },
		});
	}

	async archiveList(listId: string) {
		return this.prismaService.lists.update({
			where: { id: listId },
			data: { deletedAt: new Date(), status: ListStatusEnum.ARCHIVED },
		});
	}

	async deleteList(listId: string) {
		await this.prismaService.cards.deleteMany({
			where: { listId: listId },
		});
		return this.prismaService.lists.delete({
			where: { id: listId },
		});
	}
}
