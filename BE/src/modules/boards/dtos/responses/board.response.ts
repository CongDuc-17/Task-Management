import { z } from 'zod';

export class BoardMemberDto {
	id: string;
	// userId: string;
	// accepted: boolean;
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

export class BoardResponseDto {
	id: string;
	name: string;
	description?: string;
	projectId: string;
	memberCount: number;
	members?: BoardMemberDto[];
	background?: string;

	constructor(data: {
		id: string;
		name: string;
		description?: string;
		projectId: string;
		_count?: { boardMembers: number };
		boardMembers?: any[];
		background?: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.projectId = data.projectId;
		this.background = data.background;
		this.memberCount = data._count?.boardMembers ?? 0;
		this.members = data.boardMembers?.map((member) => new BoardMemberDto(member));
	}
}

const boardMemberDtoSchema = z.object({
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

export const boardResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	background: z.string().optional(),
	description: z.string().optional(),
	projectId: z.string(),
	memberCount: z.number(),
	members: boardMemberDtoSchema.array().optional(),
});
