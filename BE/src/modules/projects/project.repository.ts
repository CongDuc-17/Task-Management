import { projectMembers } from './../../models/modelSchema/projectMembersSchema';
import { Prisma, ProjectStatusEnum, UserStatusEnum } from '@prisma/client';

import { PrismaService } from '../database';

import { projects } from '@/models';

export class ProjectsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async createProject(name: string, description?: string): Promise<projects> {
		return this.prismaService.projects.create({
			data: {
				name,
				description,
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
			data: { status: ProjectStatusEnum.ARCHIVED },
		});
	}

	async deleteProject(projectId: string): Promise<projects> {
		return this.prismaService.projects.update({
			where: { id: projectId },
			data: { deletedAt: new Date() },
		});
	}
}
