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
import {
	deleteImageFromCloudinary,
	extractPublicIdFromUrl,
	uploadImageFromBuffer,
} from '@/common/utils/cloudinary.utils';

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
		const boardWithMembers = await this.boardsRepository.getBoardById(board.id);
		if (!boardWithMembers) {
			throw new NotFoundException('Board not found');
		}
		return {
			success: true,
			data: new BoardResponseDto({
				...boardWithMembers,
				description: boardWithMembers.description ?? undefined,
				background: boardWithMembers.background ?? undefined,
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
					background: board.background ?? undefined,
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
		if (!board) {
			throw new NotFoundException('Board not found');
		}
		return {
			success: true,
			data: new BoardResponseDto({
				...board,
				description: board.description ?? undefined,
				background: board.background ?? undefined,
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
		await this.boardsRepository.updateBoard(boardId, {
			name: data.name ?? board.name,
			description: data.description ?? board.description,
		});
		const updatedBoard = await this.boardsRepository.getBoardById(boardId);
		if (!updatedBoard) {
			throw new NotFoundException('Board not found');
		}
		return {
			success: true,
			data: new BoardResponseDto({
				...updatedBoard,
				description: updatedBoard.description ?? undefined,
				background: updatedBoard.background ?? undefined,
			}),
		};
	}

	async uploadBackground(
		boardId: string,
		file: Express.Multer.File,
	): Promise<HttpResponseBodySuccessDto<BoardResponseDto>> {
		let uploadBackground: any = null;
		const board = await this.boardsRepository.getBoardById(boardId);
		if (!board) {
			throw new NotFoundException('Board not found');
		}

		try {
			if (file) {
				uploadBackground = await uploadImageFromBuffer(
					file.buffer,
					file.mimetype,
					`TrelloLike_BoardBackgrounds`,
				);
				if (board.background) {
					const oldPublic = extractPublicIdFromUrl(board.background);
					if (oldPublic) {
						await deleteImageFromCloudinary(oldPublic);
					}
				}

				board.background = uploadBackground.secure_url;
				await this.boardsRepository.updateBoard(boardId, {
					background: board.background,
				});
			}

			return {
				success: true,
				data: new BoardResponseDto({
					...board,
					description: board.description ?? undefined,
					background: board.background ?? undefined,
				}),
			};
		} catch (error) {
			console.log('Error occurred while uploading background:', error);
			if (uploadBackground && uploadBackground.public_id) {
				await deleteImageFromCloudinary(uploadBackground.public_id);
			}
			throw new InternalServerException();
		}
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

	async changeRoleOfMemberBoard(
		boardId: string,
		userId: string,
		newRoleId: string,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const existingBoard = await this.boardsRepository.getBoardById(boardId);
		if (!existingBoard) {
			throw new NotFoundException('Board not found');
		}

		const role = await new RolesRepository().findById(newRoleId);

		if (!role) {
			throw new NotFoundException('Role not found');
		}
		if (role.status === RoleStatusEnum.INACTIVE) {
			throw new OptionalException(400, 'Role is inactive');
		}
		// Check xem role có phù hợp với phạm vi Board không (bắt đầu với BOARD_)
		if (!role.name.startsWith('BOARD_')) {
			throw new OptionalException(400, 'Role must be a board role (BOARD_*)');
		}
		if (role.name === BoardRoleEnum.BOARD_ADMIN) {
			throw new OptionalException(400, 'Cannot assign board admin role');
		}

		const isMember = await this.boardMembersRepository.isUserMemberOfBoard(
			boardId,
			userId,
		);
		if (!isMember) {
			throw new Forbidden('You are not a member of this board');
		}

		await this.boardMembersRepository.changeRoleOfMemberBoard(
			boardId,
			userId,
			newRoleId,
		);
		return {
			success: true,
			data: null,
		};
	}

	async removeMember(
		boardId: string,
		userId: string,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const existingBoard = await this.boardsRepository.getBoardById(boardId);
		if (!existingBoard) {
			throw new NotFoundException('Board not found');
		}
		const isMember = await this.boardMembersRepository.isUserMemberOfBoard(
			boardId,
			userId,
		);
		if (!isMember) {
			throw new Forbidden('You are not a member of this board');
		}
		await this.boardMembersRepository.removeMember(boardId, userId);
		return {
			success: true,
			data: null,
		};
	}
}
