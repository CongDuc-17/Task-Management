import { PrismaService } from '../database';

export class ListsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async getAllListsByBoardId(boardId: string) {
		return this.prismaService.lists.findMany({
			where: { boardId: boardId },
		});
	}

	async getLastListByBoardId(boardId: string) {
		return this.prismaService.lists.findFirst({
			where: { boardId: boardId },
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

	async softDeleteList(listId: string) {
		return this.prismaService.lists.update({
			where: { id: listId },
			data: { deletedAt: new Date() },
		});
	}

	async hardDeleteList(listId: string) {
		return this.prismaService.lists.delete({
			where: { id: listId },
		});
	}
}
