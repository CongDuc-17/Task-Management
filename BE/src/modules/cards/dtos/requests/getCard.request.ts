import z from 'zod';
import { ZodValidationSchema } from '@/common';
import { ca } from 'zod/v4/locales';
import { CardStatusEnum } from '@prisma/client';

export const getCardRequestParams = z.object({
	cardId: z.string().uuid('Invalid card ID'),
});

const getCardRequestQuery = z.object({
	include: z
		.string()
		.optional()
		.describe('Comma-separated: members,labels,checklists,comments'),
});

export const cardRequestQuery = z.object({
	status: z.enum(CardStatusEnum).optional(),
});

export const getCardRequestValidationSchema: ZodValidationSchema = {
	params: getCardRequestParams,
	query: getCardRequestQuery,
};

export const getCardRequestSchema = {
	params: getCardRequestParams,
	query: getCardRequestQuery,
};
