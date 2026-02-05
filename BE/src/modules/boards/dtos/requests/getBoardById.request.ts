import z from 'zod';
import { ZodValidationSchema } from '@/common';

export class GetBoardByIdRequestDto {
	boardId: string;
	constructor(data: { boardId: string }) {
		this.boardId = data.boardId;
	}
}

const getBoardByIdRequestParams = z
	.object({
		boardId: z.string().uuid(),
	})
	.strict();

export const GetBoardByIdRequestValidationSchema: ZodValidationSchema = {
	params: getBoardByIdRequestParams,
};

export const GetBoardByIdRequestSchema = {
	params: getBoardByIdRequestParams,
};
