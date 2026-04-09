import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class UpdateRoleMemberProjectRequestDto {
	userId: string;
	roleId: string;

	constructor(data: { userId: string; roleId: string }) {
		this.userId = data.userId;
		this.roleId = data.roleId;
	}
}

const updateRoleMemberProjectRequestBody = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid(),
});

const updateRoleMemberProjectRequestParams = z.object({
	projectId: z.string().uuid(),
});

export const UpdateRoleMemberProjectRequestValidationSchema: ZodValidationSchema = {
	params: updateRoleMemberProjectRequestParams,
	body: updateRoleMemberProjectRequestBody,
};

export const UpdateRoleMemberProjectRequestSchema = {
	params: updateRoleMemberProjectRequestParams,
	body: {
		desciption: 'Update role of a member in project',
		content: {
			'application/json': {
				schema: updateRoleMemberProjectRequestBody,
			},
		},
	},
};
