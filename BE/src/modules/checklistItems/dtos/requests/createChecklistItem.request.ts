import z from 'zod';
import { ZodValidationSchema } from '@/common';

const createChecklistItemRequestBody = z
	.object({
		title: z.string().min(1, 'Title is required').describe('Checklist item title'),
	})
	.strict();

const createChecklistItemRequestParams = z
	.object({
		checklistId: z.string().uuid('Invalid checklist ID').describe('Checklist ID'),
	})
	.strict();

export const createChecklistItemValidationSchema: ZodValidationSchema = {
	body: createChecklistItemRequestBody,
	params: createChecklistItemRequestParams,
};

export const createChecklistItemRequestSchema = {
	params: createChecklistItemRequestParams,
	body: {
		description: 'Create a new checklist item in a checklist',
		content: {
			'application/json': {
				schema: createChecklistItemRequestBody,
			},
		},
	},
};
