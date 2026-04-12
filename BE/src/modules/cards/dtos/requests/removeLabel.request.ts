import z from 'zod';
import { ZodValidationSchema } from '@/common';

// ca 2 params: cardId, labelId
const removeLabelRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
		labelId: z.string().uuid('Invalid label ID').describe('Label ID'),
	})
	.strict();

export const removeLabelRequestValidationSchema: ZodValidationSchema = {
	params: removeLabelRequestParams,
};

export const removeLabelRequestSchema = {
	params: removeLabelRequestParams,
};
