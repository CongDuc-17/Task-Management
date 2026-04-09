import z from 'zod';

export class LabelResponseDto {
	id: string;
	name: string;
	color: string;
	boardId: string;
	constructor(data?: Partial<LabelResponseDto>) {
		this.id = data?.id ?? '';
		this.name = data?.name ?? '';
		this.color = data?.color ?? '';
		this.boardId = data?.boardId ?? '';
	}
}

export const LabelResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
	boardId: z.string(),
});
