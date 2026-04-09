import z from 'zod';

import { ZodValidationSchema } from '@/common';

const checklistByIdRequestParams = z
	.object({
		checklistId: z.string().uuid('Invalid checklist ID').describe('Checklist ID'),
	})
	.strict();

export const checklistByIdValidationSchema: ZodValidationSchema = {
	params: checklistByIdRequestParams,
};

export const checklistByIdRequestSchema = {
	params: checklistByIdRequestParams,
};
