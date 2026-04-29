import z from 'zod';

import { PaginationSchema, ZodValidationSchema } from '@/common';
import { ProjectStatusEnum } from '@prisma/client';

export class GetProjectsRequestDto {
	status?: string;

	constructor(data?: Partial<GetProjectsRequestDto>) {
		this.status = data?.status;
	}
}

const getProjectsRequestQuery = z
	.object({
		status: z.enum(ProjectStatusEnum).optional(),
	})
	.extend(PaginationSchema)
	.strict();

export const getProjectsRequestValidationSchema: ZodValidationSchema = {
	query: getProjectsRequestQuery,
};

export const getProjectsRequestSchema = {
	query: getProjectsRequestQuery,
};
