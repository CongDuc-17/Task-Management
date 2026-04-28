import { z } from 'zod';

export class GetProjectsResponseDTO {
	id: string;
	name: string;
	description?: string;
	status: string;
	roleId: string;
	roleName: string;
	membersCount: number;
	boardsCount: number;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		status: string;
		roleId: string;
		roleName: string;
		membersCount: number;
		boardsCount: number;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.status = data.status;
		this.roleId = data.roleId;
		this.roleName = data.roleName;
		this.membersCount = data.membersCount;
		this.boardsCount = data.boardsCount;
	}
}

export const GetProjectsResponseDTOSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	status: z.string(),
	roleId: z.string(),
	roleName: z.string(),
	membersCount: z.number(),
	boardsCount: z.number(),
});
