import z from 'zod';

import { ZodValidationSchema } from '@/common';

export class UploadBackgroundRequestDto {
	background: string;

	constructor(data: { background: string }) {
		this.background = data.background;
	}
}

const getBoardByIdRequestParams = z
	.object({
		boardId: z.string().uuid(),
	})
	.strict();

const uploadBackgroundRequestBody = z.object({
	background: z.string().max(200),
});

const uploadBackgroundRequestValidationSchema: ZodValidationSchema = {
	params: getBoardByIdRequestParams,
	body: uploadBackgroundRequestBody,
};

export const UploadBackgroundMultipartRequestSchema = z.object({
	background: z
		.string()
		.openapi({
			format: 'binary',
			description: 'Background image file',
		})
		.optional(),
});

export const UploadBackgroundRequestSchema = {
	params: getBoardByIdRequestParams,
	body: {
		description: 'Upload a background image for the board',
		content: {
			'multipart/form-data': {
				schema: UploadBackgroundMultipartRequestSchema,
			},
		},
	},
};
