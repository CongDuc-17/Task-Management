import { Exception } from '@tsed/exceptions';
import { Request, Response } from 'express';
import { HttpResponseDto } from '@/common';
import { ListsService } from './list.service';
import { BoardsService } from '../boards/boards.service';

export class ListsController {
	constructor(private readonly listsService: ListsService = new ListsService()) {}

	async getAllListsByBoardId(req: Request): Promise<Response> {
		const { boardId } = req.params as { boardId: string };
		console.log('Fetching lists for boardId:', boardId);

		const user = req.user as { id: string };

		const result = await this.listsService.getAllListsByBoardId(boardId);
		if (result instanceof Exception) {
			console.error('Error fetching lists:', result);
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any[]>(result);
	}

	async createList(req: Request): Promise<Response> {
		console.log('🔥🔥🔥 CREATE LIST CONTROLLER CALLED 🔥🔥🔥');
		console.log('📍 BoardId:', req.params.boardId);
		console.log('📝 Name:', req.body.name);

		const { boardId } = req.params as { boardId: string };
		const { name } = req.body as { name: string };
		const user = req.user as { id: string };

		const result = await this.listsService.createList(name, boardId);
		console.log('✅ Service result:', result);

		if (result instanceof Exception) {
			console.error('❌ Exception:', result);
			return new HttpResponseDto().exception(result);
		}
		console.log('✅ Success, returning result');
		return new HttpResponseDto().success<any>(result);
	}

	async moveList(req: Request): Promise<Response> {
		const { listId } = req.params as { listId: string };
		const { beforeListId, afterListId } = req.body;

		const list = await this.listsService.getListById(listId);
		if (!list) {
			return new HttpResponseDto().exception(new Exception(404, 'List not found'));
		}

		const user = req.user as { id: string };

		const result = await this.listsService.moveList(
			listId,
			beforeListId,
			afterListId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any>(result);
	}

	async updateList(req: Request): Promise<Response> {
		try {
			console.log('🔥🔥🔥 UPDATE LIST CONTROLLER CALLED 🔥🔥🔥');
			const { listId } = req.params as { listId: string };
			const { name } = req.body;

			const result = await this.listsService.updateListName(name, listId);
			if (result instanceof Exception) {
				return new HttpResponseDto().exception(result);
			}
			return new HttpResponseDto().success<any>(result);
		} catch (error) {
			console.error('Error in updateList:', error);
			return new HttpResponseDto().exception(
				new Exception(500, 'Internal Server Error'),
			);
		}
	}

	async deleteList(req: Request): Promise<Response> {
		const { listId } = req.params as { listId: string };

		const result = await this.listsService.softDeleteList(listId);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any>(result);
	}
}
