import z from 'zod';

import { ZodValidationSchema } from '@/common';

export class CreateCardRequestDto {
	title: string;
}

const createCardRequestBody = z
	.object({
		title: z.string().min(1).max(100),
	})
	.strict();

const createCardRequestParams = z
	.object({
		listId: z.string().uuid('Invalid list ID ').describe('List ID'),
	})
	.strict();

export const createCardRequestValidationSchema: ZodValidationSchema = {
	body: createCardRequestBody,
	params: createCardRequestParams,
};

export const createCardRequestSchema = {
	params: createCardRequestParams,
	body: {
		description: 'Create a new card in a list',
		content: {
			'application/json': {
				schema: createCardRequestBody,
			},
		},
	},
};
