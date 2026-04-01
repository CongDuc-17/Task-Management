import { PrismaService } from '../database/prisma.service';

export class BoardMembersRepository {
	constructor(private readonly prisma = new PrismaService()) {}

	async getBoardsOfUser(userId: string) {
		return this.prisma.boardMembers.findMany({
			where: { userId },
			select: {
				roleId: true,
				board: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
			},
		});
	}
	async assignUserRoleBoard(boardId: string, userId: string, roleId: string) {
		return this.prisma.boardMembers.create({
			data: {
				boardId,
				userId,
				roleId,
			},
		});
	}

	async isUserMemberOfBoard(boardId: string, userId: string): Promise<boolean> {
		const m = await this.prisma.boardMembers.findFirst({
			where: { boardId, userId },
			select: { id: true },
		});
		return !!m;
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
		return this.prisma.boardMembers.deleteMany({
			where: { boardId, userId },
		});
	}
}
