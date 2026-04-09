import { z } from 'zod';
export class CardBasicResponseDto {
	id: string;
	title: string;
	description?: string;
	dueDate?: Date;
	position: number;
	listId: string;

	memberCount: number;
	labelCount: number;
	checklistCount: number;
	commentCount: number;

	_links: {
		members: string;
		labels: string;
		checklists: string;
		comments: string;
	};

	createdAt: Date;
}

export const cardBasicResponseDtoSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	description: z.string().optional(),
	dueDate: z.date().optional(),
	position: z.number(),
	listId: z.string().uuid(),
	memberCount: z.number(),
	labelCount: z.number(),
	checklistCount: z.number(),
	commentCount: z.number(),
	_links: z.object({
		members: z.string(),
		labels: z.string(),
		checklists: z.string(),
		comments: z.string(),
	}),
	createdAt: z.date(),
});
