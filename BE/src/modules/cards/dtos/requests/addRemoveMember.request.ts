import z from 'zod';
import { ZodValidationSchema } from '@/common';

const addRemoveMemberRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
	})
	.strict();

const addRemoveMemberRequestBody = z
	.object({
		userId: z.string().uuid('Invalid user ID').describe('User ID'),
	})
	.strict();

export const addRemoveMemberRequestValidationSchema: ZodValidationSchema = {
	params: addRemoveMemberRequestParams,
	body: addRemoveMemberRequestBody,
};

export const addRemoveMemberRequestSchema = {
	params: addRemoveMemberRequestParams,
	body: {
		description: 'Add or remove a member from a card',
		content: {
			'application/json': {
				schema: addRemoveMemberRequestBody,
			},
		},
	},
};
