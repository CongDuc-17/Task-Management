import { boards } from '@/models';
import { PrismaService } from '../database';
import { BoardStatusEnum } from '@prisma/client';
import { ListsRepository } from '../lists/list.repository';

export class BoardsRepository {
	constructor(
		private readonly prismaService = new PrismaService(),
		private readonly listsRepository = new ListsRepository(),
	) {}

	async createBoard(
		projectId: string,
		name: string,
		description?: string,
	): Promise<boards> {
		return this.prismaService.boards.create({
			data: {
				projectId,
				name,
				description,
			},
		});
	}

	async getBoardsByProjectId(projectId: string): Promise<boards[]> {
		return this.prismaService.boards.findMany({
			where: { projectId, deletedAt: null },
			include: {
				_count: { select: { boardMembers: true } },
			},
		});
	}
	async getBoardById(boardId: string): Promise<boards | null> {
		return this.prismaService.boards.findUnique({
			where: { id: boardId },
			include: {
				_count: { select: { boardMembers: true } },
				boardMembers: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatar: true,
							},
						},
						role: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				lists: {
					where: { deletedAt: null },
					include: {
						_count: { select: { cards: true } },
					},
				},
			},
		});
	}

	async updateBoard(boardId: string, data: Partial<boards>): Promise<boards> {
		return this.prismaService.boards.update({
			where: { id: boardId },
			data,
		});
	}

	async archiveBoard(boardId: string): Promise<boards> {
		return this.prismaService.boards.update({
			where: { id: boardId },
			data: { status: BoardStatusEnum.ARCHIVED, deletedAt: new Date() },
		});
	}

	async deleteBoard(boardId: string): Promise<boards> {
		await this.prismaService.boardMembers.deleteMany({
			where: { boardId: boardId },
		});
		await this.prismaService.labels.deleteMany({
			where: { boardId: boardId },
		});
		const lists = await this.listsRepository.getAllListsByBoardId(boardId);
		await Promise.all(lists.map((list) => this.listsRepository.deleteList(list.id)));
		return this.prismaService.boards.delete({
			where: { id: boardId },
		});
	}
}
