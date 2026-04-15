import z from 'zod';

export class CardResponseDto {
	id: string;
	title: string;
	position: number;
	listId: string;
	createdAt: Date;
	members?: string[];
	labels?: string[];
	checklists?: string[];
	comments?: string[];

	constructor(card: {
		id: string;
		title: string;
		position: number;
		listId: string;
		createdAt: Date;
		members?: string[];
		labels?: string[];
		checklists?: string[];
		comments?: string[];
	}) {
		this.id = card.id;
		this.title = card.title;
		this.position = card.position;
		this.listId = card.listId;
		this.createdAt = card.createdAt;
		this.members = card.members;
		this.labels = card.labels;
		this.checklists = card.checklists;
		this.comments = card.comments;
	}
}

export const cardResponseDtoSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	position: z.number(),
	listId: z.string().uuid(),
	createdAt: z.date(),
	members: z.array(z.string()).optional(),
	labels: z.array(z.string()).optional(),
	checklists: z.array(z.string()).optional(),
	comments: z.array(z.string()).optional(),
});

export * from './cardBasic.response';
export * from './cardWithIncludes.response';
// export * from './cardDetail.response';
