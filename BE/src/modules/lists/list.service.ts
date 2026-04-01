import { Exception } from '@tsed/exceptions';

import { HttpResponseBodySuccessDto } from '@/common/dtos/httpResponseBodySuccess.dto';
import { ListsRepository } from './list.repository';
import { calculateNewPosition } from '@/common/utils/calculateNewPosition';
import { ListResponseDto } from './dtos';
import { BoardsRepository } from '../boards/boards.repository';

export class ListsService {
	constructor(
		private readonly listsRepository: ListsRepository = new ListsRepository(),
		private readonly boardsRepository: BoardsRepository = new BoardsRepository(),
	) {}

	async getAllListsByBoardId(
		boardId: string,
	): Promise<HttpResponseBodySuccessDto<ListResponseDto[]> | Exception> {
		console.log('ListsService: getAllListsByBoardId called with boardId:', boardId);
		const board = await this.boardsRepository.getBoardById(boardId);
		if (!board) {
			throw new Exception(404, 'Board not found');
		}
		const lists = await this.listsRepository.getAllListsByBoardId(boardId);
		return {
			success: true,
			data: lists,
		};
	}

	async createList(
		nameList: string,
		boardId: string,
	): Promise<Exception | HttpResponseBodySuccessDto<ListResponseDto>> {
		const board = await this.boardsRepository.getBoardById(boardId);
		if (!board) {
			throw new Exception(404, 'Board not found');
		}
		const lastList = await this.listsRepository.getLastListByBoardId(boardId);
		const position = lastList ? lastList.position + 1 : 1;
		const newList = await this.listsRepository.createList(
			nameList,
			boardId,
			position,
		);
		return {
			success: true,
			data: newList,
		};
	}

	async moveList(
		listId: string,
		beforeListId: string,
		afterListId: string,
	): Promise<Exception | HttpResponseBodySuccessDto<ListResponseDto>> {
		try {
			const before = beforeListId
				? await this.listsRepository.getListById(beforeListId)
				: null;

			const after = afterListId
				? await this.listsRepository.getListById(afterListId)
				: null;

			const newPosition = calculateNewPosition(before?.position, after?.position);

			const updatedList = await this.listsRepository.updateListPosition(
				listId,
				newPosition,
			);
			return {
				success: true,
				data: updatedList,
			};
		} catch (error) {
			console.error('[ListsService] moveList error:', error);
			throw error;
		}
	}

	async updateListName(
		newName: string,
		listId: string,
	): Promise<Exception | HttpResponseBodySuccessDto<ListResponseDto>> {
		const list = await this.listsRepository.getListById(listId);
		if (!list) {
			throw new Exception(404, 'List not found in service');
		}

		const updatedList = await this.listsRepository.updateListName(listId, newName);
		return {
			success: true,
			data: updatedList,
		};
	}

	async getListById(
		listId: string,
	): Promise<Exception | HttpResponseBodySuccessDto<ListResponseDto>> {
		const list = await this.listsRepository.getListById(listId);
		if (!list) {
			throw new Exception(404, 'List not found');
		}
		return {
			success: true,
			data: list,
		};
	}

	async softDeleteList(listId: string) {
		const list = await this.listsRepository.getListById(listId);
		if (!list) {
			throw new Exception(404, 'List not found');
		}
		const deletedList = await this.listsRepository.softDeleteList(listId);
		return {
			success: true,
			data: deletedList,
		};
	}
}
