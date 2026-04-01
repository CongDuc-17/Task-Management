import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class CreateProjectRequestDto {
	name: string;
	description?: string;

	constructor(data: { name: string; description?: string }) {
		this.name = data.name;
		this.description = data.description;
	}
}
export const CreateProjectRequestValidationSchema: ZodValidationSchema = {
	body: z.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long' })
			.max(100),
		description: z.string().max(500).optional(),
	}),
};

export const CreateProjectRequestSchema = {
	body: {
		description: 'Create a new project',
		content: {
			'application/json': {
				schema: CreateProjectRequestValidationSchema.body!,
			},
		},
	},
};
