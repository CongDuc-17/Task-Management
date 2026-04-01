import { z } from 'zod';
export class ProjectResponseDto {
	id: string;
	name: string;
	description?: string;
	role?: string;

	constructor(data: { id: string; name: string; description?: string; role?: string }) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.role = data.role;
	}
}

export const projectResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	role: z.string().optional(),
});
