import { boards } from './../../models/modelSchema/boardsSchema';
import { Exception } from '@tsed/exceptions';
import { Request, Response } from 'express';
import { HttpResponseDto } from '@/common';
import { CardsService } from './card.service';

export class CardsController {
	constructor(private readonly cardsService: CardsService = new CardsService()) {}

	async getAllCardsByListId(req: Request): Promise<Response> {
		const { listId } = req.params as { listId: string };
		const user = req.user as { id: string };

		const result = await this.cardsService.getAllCardsByListId(listId, user.id);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any[]>(result);
	}

	async createCard(req: Request): Promise<Response> {
		try {
			const { listId } = req.params as { listId: string };
			const { title } = req.body;
			const user = req.user as { id: string };

			const result = await this.cardsService.createCard(title, listId, user.id);
			if (result instanceof Exception) {
				return new HttpResponseDto().exception(result);
			}
			return new HttpResponseDto().success<any>(result);
		} catch (error) {
			console.error('[CardsController] createCard error:', error);
			return new HttpResponseDto().exception(
				new Exception(500, 'Internal Server Error'),
			);
		}
	}

	async moveCard(req: Request): Promise<Response> {
		const { cardId } = req.params as { cardId: string };
		const { targetListId, beforeCardId, afterCardId } = req.body;
		const user = req.user as { id: string };

		const card = await this.cardsService.getCardById(cardId);
		if (!card) {
			return new HttpResponseDto().exception(new Exception(404, 'Card not found'));
		}

		const result = await this.cardsService.moveCard(
			cardId,
			targetListId,
			user.id,
			beforeCardId,
			afterCardId,
		);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any>(result);
	}

	async updateInformationCard(req: Request): Promise<Response> {
		try {
			const { cardId } = req.params as { cardId: string };
			const { title, description, members, dueDate } = req.body;
			const user = req.user as { id: string };

			const result = await this.cardsService.updateInformationCard(
				cardId,
				user.id,
				title,
				description,
				members,
				dueDate,
			);
			if (result instanceof Exception) {
				return new HttpResponseDto().exception(result);
			}
			return new HttpResponseDto().success<any>(result);
		} catch (error) {
			console.error('[CardsController] updateInformationCard error:', error);
			return new HttpResponseDto().exception(
				new Exception(500, 'Internal Server Error'),
			);
		}
	}

	async softDeleteCard(req: Request): Promise<Response> {
		const { cardId } = req.params as { cardId: string };
		const user = req.user as { id: string };
		const result = await this.cardsService.softDeleteCard(cardId, user.id);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<any>(result);
	}
}
