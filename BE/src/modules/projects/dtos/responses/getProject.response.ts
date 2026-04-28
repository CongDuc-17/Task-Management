import { z } from 'zod';

export class GetProjectResponseDTO {
	id: string;
	name: string;
	description?: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	membersCount?: number;
	boardsCount?: number;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		status: string;
		createdAt: Date;
		updatedAt: Date;
		membersCount?: number;
		boardsCount?: number;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.status = data.status;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.membersCount = data.membersCount;
		this.boardsCount = data.boardsCount;
	}
}

export const GetProjectResponseDTOSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	status: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	membersCount: z.number().optional(),
	boardsCount: z.number().optional(),
});
