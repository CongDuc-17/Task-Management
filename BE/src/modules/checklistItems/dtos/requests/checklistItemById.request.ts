import z from 'zod';
import { ZodValidationSchema } from '@/common';

const checklistItemByIdRequestParams = z
	.object({
		checklistItemId: z
			.string()
			.uuid('Invalid checklist item ID')
			.describe('Checklist item ID'),
	})
	.strict();

export const checklistItemByIdValidationSchema: ZodValidationSchema = {
	params: checklistItemByIdRequestParams,
};

export const checklistItemByIdRequestSchema = {
	params: checklistItemByIdRequestParams,
};
