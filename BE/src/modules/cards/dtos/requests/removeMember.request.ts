import z from 'zod';
import { ZodValidationSchema } from '@/common';

const removeMemberRequestParams = z
	.object({
		cardId: z.string().uuid('Invalid card ID').describe('Card ID'),
		memberId: z.string().uuid('Invalid member ID').describe('Member ID'),
	})
	.strict();

export const removeMemberRequestValidationSchema: ZodValidationSchema = {
	params: removeMemberRequestParams,
};

export const removeMemberRequestSchema = {
	params: removeMemberRequestParams,
};
