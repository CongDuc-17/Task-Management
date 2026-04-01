import { PrismaService } from '../database/prisma.service';

export class ProjectMembersRepository {
	constructor(private readonly prisma = new PrismaService()) {}

	async getProjectsOfUser(userId: string) {
		return this.prisma.projectMembers.findMany({
			where: { userId },
			include: {
				role: {
					select: {
						id: true,
						name: true,
					},
				},
				project: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
			},
		});
	}

	async assignUserRoleProject(projectId: string, userId: string, roleId: string) {
		return this.prisma.projectMembers.create({
			data: {
				projectId,
				userId,
				roleId,
			},
		});
	}
	async isUserMemberOfProject(projectId: string, userId: string): Promise<boolean> {
		const m = await this.prisma.projectMembers.findFirst({
			where: { projectId, userId },
			select: { id: true },
		});
		return !!m;
	}

	async getProjectMembers(projectId: string) {
		return this.prisma.projectMembers.findMany({
			where: { projectId },
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

	async changeRoleOfMemberProject(
		projectId: string,
		userId: string,
		newRoleId: string,
	) {
		return this.prisma.projectMembers.updateMany({
			where: { projectId, userId },
			data: { roleId: newRoleId },
		});
	}

	async removeMember(projectId: string, userId: string) {
		return this.prisma.projectMembers.deleteMany({
			where: { projectId, userId },
		});
	}
}
