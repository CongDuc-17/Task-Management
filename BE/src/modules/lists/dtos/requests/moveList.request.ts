import z from 'zod';

import { ZodValidationSchema } from '@/common';

export class MoveListRequestDto {
	beforeListId?: string;
	afterListId?: string;
}
const moveListRequestBody = z
	.object({
		beforeListId: z.string().max(100).optional(),
		afterListId: z.string().max(100).optional(),
	})
	.strict();

const moveListRequestParams = z
	.object({
		listId: z.string().uuid('Invalid list ID ').describe('List ID'),
	})
	.strict();

export const moveListRequestValidationSchema: ZodValidationSchema = {
	body: moveListRequestBody,
	params: moveListRequestParams,
};

export const moveListRequestSchema = {
	params: moveListRequestParams,
	body: {
		description: 'Move a list to a new position',
		content: {
			'application/json': {
				schema: moveListRequestBody,
			},
		},
	},
};
