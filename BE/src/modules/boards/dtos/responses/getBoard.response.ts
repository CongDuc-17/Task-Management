import { BoardStatusEnum } from '@prisma/client';
import { z } from 'zod';

export class GetBoardResponseDto {
	id: string;
	name: string;
	description?: string;
	projectId: string;
	status: BoardStatusEnum;
	background?: string;
	roleId: string;
	roleName: string;
	createdAt: Date;
	updatedAt: Date;
	memberCount: number;
	listCount: number;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		projectId: string;
		status: BoardStatusEnum;
		background?: string;
		roleId: string;
		roleName: string;
		createdAt: Date;
		updatedAt: Date;
		memberCount: number;
		listCount: number;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.projectId = data.projectId;
		this.status = data.status;
		this.background = data.background;
		this.roleId = data.roleId;
		this.roleName = data.roleName;
		this.memberCount = data.memberCount;
		this.listCount = data.listCount;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}

export const getBoardResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	background: z.string().optional(),
	description: z.string().optional(),
	projectId: z.string(),
	status: z.enum(BoardStatusEnum),
	roleId: z.string(),
	roleName: z.string(),
	memberCount: z.number(),
	listCount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
