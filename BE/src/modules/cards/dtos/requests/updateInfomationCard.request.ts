import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class UpdateInformationCardRequestDto {
	title?: string;
	description?: string;
	members?: string[];
	dueDate?: Date;
}

const updateInformationCardRequestBody = z
	.object({
		title: z
			.string()
			.min(1, 'Title cannot be empty')
			.describe('Card Title')
			.optional(),
		description: z.string().describe('Card Description').optional(),
		members: z
			.array(z.string().uuid('Invalid member ID'))
			.describe('Card Members')
			.optional(),
		dueDate: z
			.string()
			.refine((date) => !date || !isNaN(Date.parse(date)), {
				message: 'Invalid date format',
			})
			.describe('Card Due Date')
			.optional(),
	})
	.strict();
export const updateInformationCardRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID ').describe('Card ID'),
	})
	.strict();

export const updateInformationCardRequestValidationSchema: ZodValidationSchema = {
	body: updateInformationCardRequestBody,
	params: updateInformationCardRequestParams,
};

export const updateInformationCardRequestSchema = {
	params: updateInformationCardRequestParams,
	body: {
		description:
			'Update card information such as title, description, members, and due date',
		content: {
			'application/json': {
				schema: updateInformationCardRequestBody,
			},
		},
	},
};
