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

const updateRoleMemberRoleMemberBoardRequestBody = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid(),
});

const updateRoleMemberBoardRequestParams = z.object({
	boardId: z.string().uuid(),
});

export const UpdateRoleMemberBoardRequestValidationSchema: ZodValidationSchema = {
	params: updateRoleMemberBoardRequestParams,
	body: updateRoleMemberRoleMemberBoardRequestBody,
};

export const UpdateRoleMemberBoardRequestSchema = {
	params: updateRoleMemberBoardRequestParams,
	body: {
		desciption: 'Update role of a member in board',
		content: {
			'application/json': {
				schema: updateRoleMemberRoleMemberBoardRequestBody,
			},
		},
	},
};
