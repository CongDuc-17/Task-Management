import z from 'zod';
import { ZodValidationSchema } from '@/common';

const addMemberRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
	})
	.strict();

const addMemberRequestBody = z
	.object({
		userId: z.string().uuid('Invalid user ID').describe('User ID'),
	})
	.strict();

export const addMemberRequestValidationSchema: ZodValidationSchema = {
	params: addMemberRequestParams,
	body: addMemberRequestBody,
};

export const addMemberRequestSchema = {
	params: addMemberRequestParams,
	body: {
		description: 'Add a member to a card',
		content: {
			'application/json': {
				schema: addMemberRequestBody,
			},
		},
	},
};
