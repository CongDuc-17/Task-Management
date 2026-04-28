import { Request, Response } from 'express';
import { BoardsService } from './boards.service';
import {
	BoardResponseDto,
	CreateBoardRequestDto,
	NewBoardsResponseDto,
	UpdateInformationBoardRequestDto,
} from './dtos';
import { Exception } from '@tsed/exceptions';
import { HttpResponseDto, OptionalException } from '@/common';
import { boardMembers } from '@/models/modelSchema/boardMembersSchema';
import { StatusCodes } from 'http-status-codes';
import { cidrv4 } from 'zod';
export class BoardsController {
	constructor(private boardsService: BoardsService = new BoardsService()) {}
	async createBoard(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const createBoardDto = new CreateBoardRequestDto(req.body);

		const userId = (req.user as { id: string }).id;
		const result = await this.boardsService.createBoard(
			projectId,
			createBoardDto,
			userId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<BoardResponseDto>(result);
	}

	async getBoards(req: Request): Promise<Response> {
		const projectId = req.params.projectId as string;
		const userId = (req.user as { id: string }).id;
		const result = await this.boardsService.getBoardsOfUserInProject(
			projectId,
			userId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<NewBoardsResponseDto[]>(result);
	}

	async getBoardById(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;

		const userId = (req.user as { id: string }).id;
		const result = await this.boardsService.getBoardById(boardId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<BoardResponseDto>(result);
	}

	async updateBoardInformation(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;
		const updateBoardDto = new UpdateInformationBoardRequestDto(req.body);

		const result = await this.boardsService.updateBoard(boardId, updateBoardDto);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<BoardResponseDto>(result);
	}

	async uploadBackground(req: Request, res: Response): Promise<Response> {
		const boardId = req.params.boardId as string;
		const file = req.file as Express.Multer.File;
		if (!file) {
			return new HttpResponseDto().exception(
				new OptionalException(400, 'File is required'),
			);
		}

		const result = await this.boardsService.uploadBackground(boardId, file);
		if (result instanceof Exception) {
			return res.status(result.status || 400).json({
				success: false,
				message: result.message,
			});
		}
		return res.status(StatusCodes.OK).json({
			success: true,
			data: result.data,
		});
	}

	async archiveBoard(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;
		const userId = (req.user as { id: string }).id;
		const result = await this.boardsService.archiveBoard(boardId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}

	async deleteBoard(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;

		const result = await this.boardsService.deleteBoard(boardId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}

	async changeRoleOfMemberBoard(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;
		const { userId, roleId } = req.body;

		const result = await this.boardsService.changeRoleOfMemberBoard(
			boardId,
			userId,
			roleId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}

	async removeMember(req: Request): Promise<Response> {
		const boardId = req.params.boardId as string;
		const { userId } = req.body;
		const result = await this.boardsService.removeMember(boardId, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<null>(result);
	}
}
