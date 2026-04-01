import { Request, Response } from 'express';
import { BoardsService } from './boards.service';
import {
	BoardResponseDto,
	CreateBoardRequestDto,
	UpdateInformationBoardRequestDto,
} from './dtos';
import { Exception } from '@tsed/exceptions';
import { HttpResponseDto } from '@/common/dtos/httpResponse.dto';

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
		const result = await this.boardsService.getBoardsByProjectId(projectId, userId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<BoardResponseDto[]>(result);
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
		const userId = (req.user as { id: string }).id;
		const result = await this.boardsService.updateBoard(boardId, updateBoardDto);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<BoardResponseDto>(result);
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
}
