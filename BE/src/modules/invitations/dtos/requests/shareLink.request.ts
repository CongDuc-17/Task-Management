import { z } from 'zod';
import { ZodValidationSchema } from '@/common';
export class ShareLinkRequestDto {
	roleId?: string;
	constructor(data?: Partial<ShareLinkRequestDto>) {
		this.roleId = data?.roleId;
	}
}

const shareLinkBodyRequestSchema = z.object({
	roleId: z.string().optional(),
});

const shareLinkForProjectRequestParams = z
	.object({
		projectId: z.string().uuid(),
	})
	.strict();

const shareLinkForBoardRequestParams = z
	.object({
		boardId: z.string().uuid(),
	})
	.strict();
export const ShareLinkRequestValidationSchema: ZodValidationSchema = {
	params: shareLinkForProjectRequestParams || shareLinkForBoardRequestParams,
	body: shareLinkBodyRequestSchema,
};
export const ShareLinkRequestSchema = {
	params: shareLinkForProjectRequestParams || shareLinkForBoardRequestParams,
	body: {
		description: 'Share Link Body',
		content: {
			'application/json': {
				schema: shareLinkBodyRequestSchema,
			},
		},
	},
};
