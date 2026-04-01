import { z } from 'zod';

export class ProjectMemberDto {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
		avatar: string | null;
	};
	role: {
		id: string;
		name: string;
	};

	constructor(data: any) {
		this.id = data.id;
		// this.userId = data.userId;
		// this.accepted = data.accepted;
		this.user = {
			id: data.user.id,
			name: data.user.name,
			email: data.user.email,
			avatar: data.user.avatar,
		};
		this.role = {
			id: data.role.id,
			name: data.role.name,
		};
	}
}

const projectMemberDtoSchema = z.object({
	id: z.string(),
	// userId: z.string(),
	// accepted: z.boolean(),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		avatar: z.string().nullable(),
	}),
	role: z.object({
		id: z.string(),
		name: z.string(),
	}),
});
export class ProjectResponseDto {
	id: string;
	name: string;
	description?: string;
	role?: string;
	memberCount: number;
	members?: ProjectMemberDto[];

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		role?: string;
		_count?: { members: number };
		members?: any[];
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.role = data.role;
		this.memberCount = data._count?.members ?? 0;
		this.members = data.members?.map((member) => new ProjectMemberDto(member));
	}
}

export const projectResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	role: z.string().optional(),
	memberCount: z.number(),
	members: projectMemberDtoSchema.array().optional(),
});
