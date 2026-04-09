import z from 'zod';
import { ZodValidationSchema } from '@/common';

const createLabelRequestBody = z
	.object({
		name: z.string().min(1).max(50),
		// Mã màu hex (định dạng #RRGGBB)
		color: z
			.string()
			.length(7)
			.regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
	})
	.strict();
const createLabelRequestParams = z
	.object({
		boardId: z.string().uuid('Invalid board ID').describe('Board ID'),
	})
	.strict();

export const createLabelRequestValidationSchema: ZodValidationSchema = {
	body: createLabelRequestBody,
	params: createLabelRequestParams,
};

export const createLabelRequestSchema = {
	params: createLabelRequestParams,
	body: {
		description: 'Create a new label in a board',
		content: {
			'application/json': {
				schema: createLabelRequestBody,
			},
		},
	},
};
