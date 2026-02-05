import { boardMembers } from './../../models/modelSchema/boardMembersSchema';
import {
	HttpResponseBodySuccessDto,
	InternalServerException,
	NotFoundException,
	ObjectComparerDto,
	OptionalException,
	PaginationDto,
	PaginationUtils,
} from '@/common';
import { BoardsRepository } from './boards.repository';

import { RoleStatusEnum } from '@prisma/client';

import { RolesRepository } from '../roles/roles.repository';
import { Forbidden } from '@tsed/exceptions';
import { BoardMembersRepository } from '../boardMembers/boardMember.repository';
import {
	BoardResponseDto,
	CreateBoardRequestDto,
	UpdateInformationBoardRequestDto,
} from './dtos';
import { BoardRoleEnum } from '@/common/enums/roles';
import { ProjectsRepository } from '../projects/project.repository';
import { ProjectMembersRepository } from '../projectMembers/projectMember.repository';

export class BoardsService {
	constructor(
		private readonly projectsRepository: ProjectsRepository = new ProjectsRepository(),
		private readonly projectMembersRepository: ProjectMembersRepository = new ProjectMembersRepository(),
		private readonly boardsRepository: BoardsRepository = new BoardsRepository(),
		private readonly boardMembersRepository: BoardMembersRepository = new BoardMembersRepository(),
		private readonly rolesRepository: RolesRepository = new RolesRepository(),
	) {}

	async createBoard(
		projectId: string,
		createBoard: CreateBoardRequestDto,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<BoardResponseDto>> {
		const boardAdminRole = await this.rolesRepository.findByName(
			BoardRoleEnum.BOARD_ADMIN,
		);
		if (!boardAdminRole) {
			throw new NotFoundException('Board admin role not found');
		}

		const project = await this.projectsRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundException('Project not found');
		}

		const isMemberProject = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);
		if (!isMemberProject) {
			throw new Forbidden('You are not a member of this project');
		}

		const board = await this.boardsRepository.createBoard(
			projectId,
			createBoard.name,
			createBoard.description,
		);

		const adminBoard = await this.boardMembersRepository.assignUserRoleBoard(
			board.id,
			userId,
			boardAdminRole.id,
		);
		return {
			success: true,
			data: new BoardResponseDto({
				...board,
				description: board.description ?? undefined,
				projectId: board.projectId,
			}),
		};
	}

	async getBoardsByProjectId(
		projectId: string,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<BoardResponseDto[]>> {
		const project = await this.projectsRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundException('Project not found');
		}
		const isMemberProject = await this.projectMembersRepository.isUserMemberOfProject(
			projectId,
			userId,
		);
		if (!isMemberProject) {
			throw new Forbidden('You are not a member of this project');
		}
		const boards = await this.boardsRepository.getBoardsByProjectId(projectId);
		const boardDtos = boards.map(
			(board) =>
				new BoardResponseDto({
					...board,
					description: board.description ?? undefined,
				}),
		);
		return {
			success: true,
			data: boardDtos,
		};
	}

	async getBoardById(
		boardId: string,
	): Promise<HttpResponseBodySuccessDto<BoardResponseDto>> {
		const board = await this.boardsRepository.getBoardById(boardId);
		console.log(board);
		console.log(boardId);
		if (!board) {
			throw new NotFoundException('Board not found');
		}
		return {
			success: true,
			data: new BoardResponseDto({
				...board,
				description: board.description ?? undefined,
			}),
		};
	}

	async updateBoard(
		boardId: string,
		data: UpdateInformationBoardRequestDto,
	): Promise<HttpResponseBodySuccessDto<BoardResponseDto>> {
		const board = await this.boardsRepository.getBoardById(boardId);
		if (!board) {
			throw new NotFoundException('Board not found');
		}
		const updatedBoard = await this.boardsRepository.updateBoard(boardId, {
			name: data.name ?? board.name,
			description: data.description ?? board.description,
		});
		return {
			success: true,
			data: new BoardResponseDto({
				...updatedBoard,
				description: updatedBoard.description ?? undefined,
			}),
		};
	}

	async archiveBoard(boardId: string): Promise<HttpResponseBodySuccessDto<null>> {
		const board = await this.boardsRepository.getBoardById(boardId);
		if (!board) {
			throw new NotFoundException('Board not found');
		}

		await this.boardsRepository.archiveBoard(boardId);
		return {
			success: true,
			data: null,
		};
	}
}
