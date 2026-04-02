import z from 'zod';
import { ZodValidationSchema } from '@/common';

// ca 2 params: cardId, labelId
const addRemoveLabelRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
		labelId: z.string().uuid('Invalid label ID').describe('Label ID'),
	})
	.strict();

export const addRemoveLabelRequestValidationSchema: ZodValidationSchema = {
	params: addRemoveLabelRequestParams,
};

export const addRemoveLabelRequestSchema = {
	params: addRemoveLabelRequestParams,
};
