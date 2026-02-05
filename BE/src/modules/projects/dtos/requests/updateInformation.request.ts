import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class UpdateInformationRequestDto {
	name?: string;
	description?: string;

	constructor(data: { name?: string; description?: string }) {
		this.name = data.name;
		this.description = data.description;
	}
}

const updateInformationRequestBody = z
	.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long' })
			.max(100)
			.optional(),
		description: z.string().max(500).optional(),
	})
	.strict();

const updateInformationRequestParams = z
	.object({
		projectId: z.string().uuid(),
	})
	.strict();

export const UpdateInformationRequestValidationSchema: ZodValidationSchema = {
	params: updateInformationRequestParams,
	body: updateInformationRequestBody,
};

export const UpdateInformationRequestSchema = {
	params: updateInformationRequestParams,
	body: {
		description: 'Update project information',
		content: {
			'application/json': {
				schema: updateInformationRequestBody,
			},
		},
	},
};
