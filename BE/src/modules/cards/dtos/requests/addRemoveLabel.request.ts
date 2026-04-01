import z from 'zod';
import { ZodValidationSchema } from '@/common';

const addRemoveLabelRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
	})
	.strict();

const addRemoveLabelRequestBody = z
	.object({
		labelId: z.string().uuid('Invalid label ID').describe('Label ID'),
	})
	.strict();

export const addRemoveLabelRequestValidationSchema: ZodValidationSchema = {
	body: addRemoveLabelRequestBody,
	params: addRemoveLabelRequestParams,
};

export const addRemoveLabelRequestSchema = {
	params: addRemoveLabelRequestParams,
	body: {
		description: 'Add or remove a label from a card',
		content: {
			'application/json': {
				schema: addRemoveLabelRequestBody,
			},
		},
	},
};
