import z from 'zod';

export class ChecklistItemResponseDto {
	id: string;
	title: string;
	isCompleted: boolean;
	checklistId: string;

	constructor(checklistItem: {
		id: string;
		title: string;
		isCompleted: boolean;
		checklistId: string;
	}) {
		this.id = checklistItem.id;
		this.title = checklistItem.title;
		this.isCompleted = checklistItem.isCompleted;
		this.checklistId = checklistItem.checklistId;
	}
}

export const checklistItemResponseDtoSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	isCompleted: z.boolean(),
	checklistId: z.string().uuid(),
});
