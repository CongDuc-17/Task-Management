import z from 'zod';

export class CardResponseDto {
	id: string;
	title: string;
	position: number;
	listId: string;
	createdAt: Date;

	constructor(card: {
		id: string;
		title: string;
		position: number;
		listId: string;
		createdAt: Date;
	}) {
		this.id = card.id;
		this.title = card.title;
		this.position = card.position;
		this.listId = card.listId;
		this.createdAt = card.createdAt;
	}
}

export const cardResponseDtoSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	position: z.number(),
	listId: z.string().uuid(),
	createdAt: z.date(),
});
