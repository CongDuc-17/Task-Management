import z from 'zod';

export class ListResponseDto {
	id: string;
	name: string;
	position: number;
	boardId: string;
	createdAt: Date;
	updatedAt: Date;
	constructor(list: {
		id: string;
		name: string;
		position: number;
		boardId: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this.id = list.id;
		this.name = list.name;
		this.position = list.position;
		this.boardId = list.boardId;
		this.createdAt = list.createdAt;
		this.updatedAt = list.updatedAt;
	}
}

export const listResponseDtoSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	position: z.number(),
	boardId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
