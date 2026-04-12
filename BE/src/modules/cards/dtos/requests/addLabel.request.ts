import z from 'zod';
import { ZodValidationSchema } from '@/common';

// ca 2 params: cardId, labelId
const addLabelRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
	})
	.strict();

const addLabelRequestBody = z
	.object({
		labelId: z.string().uuid('Invalid label ID').describe('Label ID'),
	})
	.strict();

export const addLabelRequestValidationSchema: ZodValidationSchema = {
	params: addLabelRequestParams,
	body: addLabelRequestBody,
};

export const addLabelRequestSchema = {
	params: addLabelRequestParams,
	body: {
		description: 'Add a label to a card',
		content: {
			'application/json': {
				schema: addLabelRequestBody,
			},
		},
	},
};
