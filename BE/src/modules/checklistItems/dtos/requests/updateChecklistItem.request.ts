import z from 'zod';
import { ZodValidationSchema } from '@/common';

const updateChecklistItemRequestParams = z
	.object({
		checklistItemId: z
			.string()
			.uuid('Invalid checklist item ID')
			.describe('Checklist item ID'),
	})
	.strict();

const updateChecklistItemRequestBody = z
	.object({
		content: z.string().min(1).max(255).describe('Updated checklist item content'),
		isCompleted: z.boolean().describe('Updated checklist item completion status'),
	})
	.strict();

export const updateChecklistItemValidationSchema: ZodValidationSchema = {
	params: updateChecklistItemRequestParams,
	body: updateChecklistItemRequestBody,
};

export const updateChecklistItemRequestSchema = {
	params: updateChecklistItemRequestParams,
	body: {
		description: 'Update the content and completion status of a checklist item',
		content: {
			'application/json': {
				schema: updateChecklistItemRequestBody,
			},
		},
	},
};
