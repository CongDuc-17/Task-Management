import { projectMembers } from './../../models/modelSchema/projectMembersSchema';
import { Prisma, ProjectStatusEnum, UserStatusEnum } from '@prisma/client';

import { PrismaService } from '../database';

import { projects } from '@/models';
import { BoardsRepository } from '../boards/boards.repository';

export class ProjectsRepository {
	constructor(
		private readonly prismaService = new PrismaService(),
		private readonly boardsRepository = new BoardsRepository(),
	) {}

	async createProject(
		name: string,
		description?: string,
		background?: string,
	): Promise<projects> {
		return this.prismaService.projects.create({
			data: {
				name,
				description,
				background,
			},
		});
	}

	async getProjectById(projectId: string): Promise<projects | null> {
		return this.prismaService.projects.findUnique({
			where: { id: projectId },
			include: {
				_count: { select: { members: true } },
				members: {
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
				boards: {
					select: {
						id: true,
						name: true,
						description: true,
						background: true,
						status: true,
					},
				},
			},
		});
	}

	async updateProject(
		projectId: string,
		data: Prisma.projectsUpdateInput,
	): Promise<projects> {
		return this.prismaService.projects.update({
			where: { id: projectId },
			data,
		});
	}

	async archiveProject(projectId: string): Promise<projects> {
		return this.prismaService.projects.update({
			where: { id: projectId },
			data: { status: ProjectStatusEnum.ARCHIVED, deletedAt: new Date() },
		});
	}

	async deleteProject(projectId: string): Promise<projects> {
		await this.prismaService.projectMembers.deleteMany({
			where: { projectId: projectId },
		});

		const boards = await this.prismaService.boards.findMany({
			where: { projectId: projectId },
			select: { id: true },
		});
		await Promise.all(
			boards.map((board) => this.boardsRepository.deleteBoard(board.id)),
		);
		return this.prismaService.projects.delete({
			where: { id: projectId },
		});
	}
}
