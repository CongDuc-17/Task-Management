import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class MoveCardRequestDto {
	targetListId: string;
	beforeCardId?: string;
	afterCardId?: string;
}

const moveCardRequestBody = z
	.object({
		targetListId: z.string().uuid('Invalid list ID ').describe('Target List ID'),
		beforeCardId: z
			.string()
			.uuid('Invalid card ID ')

			.describe('Before Card ID')
			.optional(),
		afterCardId: z
			.string()
			.uuid('Invalid card ID ')

			.describe('After Card ID')
			.optional(),
	})
	.strict();

export const moveCardRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID ').describe('Card ID'),
	})
	.strict();

export const moveCardRequestValidationSchema: ZodValidationSchema = {
	body: moveCardRequestBody,
	params: moveCardRequestParams,
};

export const moveCardRequestSchema = {
	params: moveCardRequestParams,
	body: {
		description: 'Move a card to a new position in a list or to another list',
		content: {
			'application/json': {
				schema: moveCardRequestBody,
			},
		},
	},
};
