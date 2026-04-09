import { ZodValidationSchema } from '@/common';
import { z } from 'zod';

export class CreateInvitationRequestDto {
	email: string;
	projectId?: string;
	boardId?: string;
	roleId?: string;

	constructor(data?: Partial<CreateInvitationRequestDto>) {
		this.email = data?.email ?? '';
		this.projectId = data?.projectId;
		this.boardId = data?.boardId;
		this.roleId = data?.roleId;
	}
}

export const CreateInvitationBodyRequestSchema = z.object({
	email: z.string().email(),
	roleId: z.string().optional(),
});
const getProjectByIdRequestParams = z
	.object({
		projectId: z.string().uuid(),
	})
	.strict();

const getBoardByIdRequestParams = z
	.object({
		boardId: z.string().uuid(),
	})
	.strict();

export const CreateInvitationRequestValidationSchemaProject: ZodValidationSchema = {
	params: getProjectByIdRequestParams,
	body: CreateInvitationBodyRequestSchema,
};

export const CreateInvitationRequestValidationSchemaBoard: ZodValidationSchema = {
	params: getBoardByIdRequestParams,
	body: CreateInvitationBodyRequestSchema,
};

export const CreateInvitationRequestSchema = (type: 'project' | 'board') => ({
	params: type === 'project' ? getProjectByIdRequestParams : getBoardByIdRequestParams,
	body: {
		description: 'Create Invitation Body',
		content: {
			'application/json': {
				schema: CreateInvitationBodyRequestSchema,
			},
		},
	},
});
