import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class GetProjectByIdRequestDto {
	projectId: string;
	constructor(data: { projectId: string }) {
		this.projectId = data.projectId;
	}
}

const getProjectByIdRequestParams = z
	.object({
		projectId: z.string().uuid(),
	})
	.strict();

export const GetProjectByIdRequestValidationSchema: ZodValidationSchema = {
	params: getProjectByIdRequestParams,
};

export const GetProjectByIdRequestSchema = {
	params: getProjectByIdRequestParams,
};
