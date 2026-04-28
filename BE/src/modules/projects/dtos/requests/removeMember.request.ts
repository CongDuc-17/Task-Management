import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class RemoveMemberProjectRequestDto {
	userId: string;

	constructor(data: { userId: string }) {
		this.userId = data.userId;
	}
}

const removeMemberProjectRequestBody = z.object({
	userId: z.string().uuid(),
});
const removeMemberProjectRequestParams = z.object({
	projectId: z.string().uuid(),
});

export const RemoveMemberProjectRequestValidationSchema: ZodValidationSchema = {
	params: removeMemberProjectRequestParams,
	body: removeMemberProjectRequestBody,
};

export const RemoveMemberProjectRequestSchema = {
	params: removeMemberProjectRequestParams,
	body: {
		description: 'Remove a member from project',
		content: {
			'application/json': {
				schema: removeMemberProjectRequestBody,
			},
		},
	},
};
