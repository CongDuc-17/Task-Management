import { ProjectsRepository } from './project.repository';

import {
	HttpResponseBodySuccessDto,
	InternalServerException,
	NotFoundException,
	ObjectComparerDto,
	OptionalException,
	PaginationDto,
	PaginationUtils,
} from '@/common';
import { CreateProjectRequestDto } from './dtos/requests';
import { ProjectResponseDto } from './dtos/responses/project.response';
import { ProjectMembersRepository } from '../projectMembers/projectMember.repository';
import { RoleStatusEnum } from '@prisma/client';
import { ProjectRoleEnum } from '@/common/enums/roles';
import { RolesRepository } from '../roles/roles.repository';
import { Forbidden } from '@tsed/exceptions';

export class ProjectsService {
	constructor(
		private readonly projectsRepository: ProjectsRepository = new ProjectsRepository(),
		private readonly projectMembersRepository: ProjectMembersRepository = new ProjectMembersRepository(),
		private readonly rolesRepository: RolesRepository = new RolesRepository(),
	) {}

	async createProject(
		createProject: CreateProjectRequestDto,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<ProjectResponseDto>> {
		const projectAdminRole = await this.rolesRepository.findByName(
			ProjectRoleEnum.PROJECT_ADMIN,
		);
		if (!projectAdminRole) {
			throw new NotFoundException('Project admin role not found');
		}

		const project = await this.projectsRepository.createProject(
			createProject.name,
			createProject.description,
		);
		const admin = await this.projectMembersRepository.assignUserRoleProject(
			project.id,
			userId,
			projectAdminRole.id,
		);
		return {
			success: true,
			data: new ProjectResponseDto({
				...project,
				description: project.description ?? undefined,
				role: projectAdminRole.id,
			}),
		};
	}

	async getProjectById(
		projectId: string,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<ProjectResponseDto>> {
		const project = await this.projectsRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundException('Project not found');
		}

		return {
			success: true,
			data: new ProjectResponseDto({
				...project,
				description: project.description ?? undefined,
			}),
		};
	}

	async getAllProjects(
		userId: string,
	): Promise<HttpResponseBodySuccessDto<ProjectResponseDto[]>> {
		const userProjects =
			await this.projectMembersRepository.getProjectsOfUser(userId);
		const projects = userProjects.map(
			(up) =>
				new ProjectResponseDto({
					...up.project,
					description: up.project.description ?? undefined,
					role: up.roleId,
				}),
		);

		return {
			success: true,
			data: projects,
		};
	}

	async updateInformationProject(
		projectId: string,
		userId: string,
		updateData: Partial<CreateProjectRequestDto>,
	): Promise<HttpResponseBodySuccessDto<ProjectResponseDto>> {
		const project = await this.projectsRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundException('Project not found');
		}
		const isMember = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);
		if (!isMember) {
			throw new Forbidden('You are not a member of this project');
		}

		const updatePayload: any = {};

		if (updateData.name && updateData.name !== project.name) {
			updatePayload.name = updateData.name;
		}

		if (
			updateData.description !== undefined &&
			updateData.description !== project.description
		) {
			updatePayload.description = updateData.description;
		}

		if (Object.keys(updatePayload).length === 0) {
			console.log('No changes detected, skipping update.');
			return {
				success: true,
				data: new ProjectResponseDto({
					...project,
					description: project.description ?? undefined,
				}),
			};
		}

		const updatedProject = await this.projectsRepository.updateProject(
			projectId,
			updatePayload,
		);

		return {
			success: true,
			data: new ProjectResponseDto({
				...updatedProject,
				description: updatedProject.description ?? undefined,
			}),
		};
	}

	async archiveProject(
		projectId: string,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const project = await this.projectsRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundException('Project not found');
		}
		const isMember = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);
		if (!isMember) {
			throw new Forbidden('You are not a member of this project');
		}

		await this.projectsRepository.archiveProject(projectId);

		return {
			success: true,
			data: null,
		};
	}

	async changeRoleMemberProject(
		projectId: string,
		userId: string,
		newRoleId: string,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const existingProject = await this.projectsRepository.getProjectById(projectId);
		if (!existingProject) {
			throw new NotFoundException('Project not found');
		}

		const role = await this.rolesRepository.findById(newRoleId);
		if (!role) {
			throw new NotFoundException('Role not found');
		}
		if (role.status === RoleStatusEnum.INACTIVE) {
			throw new OptionalException(400, 'Role is inactive');
		}
		// Check xem role có phù hợp với phạm vi Project không (bắt đầu với PROJECT_)
		if (!role.name.startsWith('PROJECT_')) {
			throw new OptionalException(400, 'Role must be a project role (PROJECT_*)');
		}
		if (role.name === ProjectRoleEnum.PROJECT_ADMIN) {
			throw new OptionalException(400, 'Cannot assign project admin role');
		}
		const isMember = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);
		if (!isMember) {
			throw new Forbidden('You are not a member of this project');
		}

		const changed = await this.projectMembersRepository.changeRoleOfMemberProject(
			projectId,
			userId,
			newRoleId,
		);

		console.log('Changed role of member project result:', changed);
		return {
			success: changed.count > 0,
			data: null,
		};
	}

	async removeMember(
		projectId: string,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const existingProject = await this.projectsRepository.getProjectById(projectId);
		if (!existingProject) {
			throw new NotFoundException('Project not found');
		}
		const isMember = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);

		if (!isMember) {
			throw new Forbidden('You are not a member of this project');
		}
		await this.projectMembersRepository.removeMember(projectId, userId);

		return {
			success: true,
			data: null,
		};
	}
}
