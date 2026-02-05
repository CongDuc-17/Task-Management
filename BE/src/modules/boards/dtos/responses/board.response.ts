import { z } from 'zod';
export class BoardResponseDto {
	id: string;
	name: string;
	description?: string;
	projectId: string;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		projectId: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.projectId = data.projectId;
	}
}
export const boardResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	projectId: z.string(),
});
