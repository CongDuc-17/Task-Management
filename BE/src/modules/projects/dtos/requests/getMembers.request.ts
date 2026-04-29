import z from 'zod';

import { PaginationSchema, ZodValidationSchema } from '@/common';

const getMembersRequestQuery = z.object().extend(PaginationSchema).strict();
const getMembersRequestParams = z
	.object({
		projectId: z.string().uuid(),
	})
	.strict();

export const GetMembersRequestValidationSchema: ZodValidationSchema = {
	query: getMembersRequestQuery,
	params: getMembersRequestParams,
};

export const GetMembersRequestSchema = {
	query: getMembersRequestQuery,
	params: getMembersRequestParams,
};
