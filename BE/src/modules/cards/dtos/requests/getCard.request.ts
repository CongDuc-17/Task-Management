import z from 'zod';
import { ZodValidationSchema } from '@/common';

export const getCardRequestParams = z.object({
	cardId: z.string().uuid('Invalid card ID'),
});

const getCardRequestQuery = z.object({
	include: z
		.string()
		.optional()
		.describe('Comma-separated: members,labels,checklists,comments'),
});

export const getCardRequestValidationSchema: ZodValidationSchema = {
	params: getCardRequestParams,
	query: getCardRequestQuery,
};

export const getCardRequestSchema = {
	params: getCardRequestParams,
	query: getCardRequestQuery,
};
