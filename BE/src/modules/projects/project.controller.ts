import { Request, Response } from 'express';
import { ProjectsService } from './project.service';
import { CreateProjectRequestDto } from './dtos/requests/createProject.request';
import { HttpResponseDto } from '@/common/dtos/httpResponse.dto';
import { ProjectResponseDto } from './dtos/responses/project.response';
import { Exception } from '@tsed/exceptions';
export class ProjectsController {
	constructor(
		private readonly projectService: ProjectsService = new ProjectsService(),
	) {}

	async createProject(req: Request): Promise<Response> {
		const createProjectDto = new CreateProjectRequestDto(req.body);
		const userId = (req.user as { id: string }).id;
		const result = await this.projectService.createProject(createProjectDto, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<ProjectResponseDto>(result);
	}

	async getAllProjects(req: Request): Promise<Response> {
		const userId = (req.user as { id: string }).id;
		const result = await this.projectService.getAllProjects(userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<ProjectResponseDto[]>(result);
	}

	async getProjectById(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const userId = (req.user as { id: string }).id;

		const result = await this.projectService.getProjectById(projectId, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<ProjectResponseDto>(result);
	}

	async updateProject(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const updateData = req.body;
		const userId = (req.user as { id: string }).id;
		const result = await this.projectService.updateInformationProject(
			projectId,
			userId,
			updateData,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<ProjectResponseDto>(result);
	}

	async archiveProject(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const userId = (req.user as { id: string }).id;
		const result = await this.projectService.archiveProject(projectId, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}

	async changeRoleMemberProject(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;

		const { userId, roleId } = req.body;
		const result = await this.projectService.changeRoleMemberProject(
			projectId,
			userId,
			roleId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}

	async removeMember(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const { userId } = req.body;
		const result = await this.projectService.removeMember(projectId, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}
}
