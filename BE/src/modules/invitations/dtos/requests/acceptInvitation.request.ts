import { ZodValidationSchema } from '@/common';
import { z } from 'zod';

export class AcceptInvitationRequestDto {
	token: string;
	constructor(data?: Partial<AcceptInvitationRequestDto>) {
		this.token = data?.token ?? '';
	}
}

const tokenRequestParams = z
	.object({
		token: z.string(),
	})
	.strict();

export const TokenRequestValidationSchema: ZodValidationSchema = {
	params: tokenRequestParams,
};
export const TokenInvitationRequestSchema = {
	params: tokenRequestParams,
};
