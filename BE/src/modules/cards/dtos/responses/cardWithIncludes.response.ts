import { CardBasicResponseDto, cardBasicResponseDtoSchema } from './cardBasic.response';

import { z } from 'zod';
export class CardWithIncludesResponseDto extends CardBasicResponseDto {
	members?: {
		id: string;
		userId: string;
		userName: string;
		userAvatar?: string;
	}[];

	labels?: {
		id: string;
		name: string;
		color: string;
	}[];

	checklists?: {
		id: string;
		title: string;
		itemCount: number;
		completedCount: number;
	}[];

	comments?: {
		id: string;
		content: string;
		authorName: string;
		createdAt: Date;
	}[];

	memberSchema = z.object({
		id: z.string().uuid(),
		userId: z.string().uuid(),
		userName: z.string(),
		userAvatar: z.string().optional(),
	});

	labelSchema = z.object({
		id: z.string().uuid(),
		name: z.string(),
		color: z.string(),
	});

	checklistSchema = z.object({
		id: z.string().uuid(),
		title: z.string(),
		itemCount: z.number(),
		completedCount: z.number(),
	});

	commentSchema = z.object({
		id: z.string().uuid(),
		content: z.string(),
		authorName: z.string(),
		createdAt: z.date(),
	});

	cardWithIncludesResponseDtoSchema = cardBasicResponseDtoSchema.extend({
		members: z.array(this.memberSchema).optional(),
		labels: z.array(this.labelSchema).optional(),
		checklists: z.array(this.checklistSchema).optional(),
		comments: z.array(this.commentSchema).optional(),
	});
}
