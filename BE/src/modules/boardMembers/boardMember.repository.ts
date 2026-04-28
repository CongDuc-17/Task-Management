import { BoardStatusEnum } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export class BoardMembersRepository {
	constructor(private readonly prisma = new PrismaService()) {}

	async getBoardsOfUserInProject(
		projectId: string,
		userId: string,
		skip = 0,
		take = 20,
	) {
		return this.prisma.boardMembers.findMany({
			where: {
				userId,
				board: {
					projectId,
					status: BoardStatusEnum.ACTIVE,
				},
			},
			skip,
			take,
			select: {
				id: true,
				userId: true,
				boardId: true,
				role: {
					select: {
						id: true,
						name: true,
					},
				},
				board: {
					select: {
						id: true,
						name: true,
						description: true,
						background: true,
						status: true,
						_count: {
							select: {
								lists: true,
								boardMembers: true,
							},
						},
					},
				},
			},
			orderBy: {
				invitedAt: 'desc',
			},
		});
	}

	// async getBoardsOfUser(userId: string) {
	// 	return this.prisma.boardMembers.findMany({
	// 		where: { userId },
	// 		select: {
	// 			roleId: true,
	// 			board: {
	// 				select: {
	// 					id: true,
	// 					name: true,
	// 					description: true,
	// 				},
	// 			},
	// 		},
	// 	});
	// }
	async assignUserRoleBoard(boardId: string, userId: string, roleId: string) {
		return this.prisma.boardMembers.create({
			data: {
				boardId,
				userId,
				roleId,
			},
		});
	}

	async isUserMemberOfBoard(boardId: string, userId: string) {
		const m = await this.prisma.boardMembers.findFirst({
			where: { boardId, userId },
			include: {
				role: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});
		return m;
	}

	async getBoardMembers(boardId: string) {
		return this.prisma.boardMembers.findMany({
			where: { boardId },
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
		});
	}

	async changeRoleOfMemberBoard(boardId: string, userId: string, newRoleId: string) {
		return this.prisma.boardMembers.updateMany({
			where: { boardId, userId },
			data: { roleId: newRoleId },
		});
	}
	async removeMember(boardId: string, userId: string) {
		await this.prisma.cardMembers.deleteMany({
			where: { userId },
		});

		return this.prisma.boardMembers.deleteMany({
			where: { boardId, userId },
		});
	}
}
