import { z } from 'zod';

export class UpdateBoardResponseDto {
	id: string;
	name: string;
	description?: string;
	projectId: string;
	background?: string;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		projectId: string;
		background?: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.projectId = data.projectId;
		this.background = data.background;
	}
}

export const updateBoardResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	projectId: z.string(),
	background: z.string().optional(),
});
