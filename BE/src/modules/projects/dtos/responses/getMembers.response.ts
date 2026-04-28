import { z } from 'zod';

export class GetMembersResponseDTO {
	projectId: string;
	id: string;
	name: string;
	email: string;
	avatar: string | null | undefined;
	acceptedAt: Date | null | undefined;
	invitedAt: Date | null | undefined;
	roleId: string;
	roleName: string;

	constructor(data: {
		projectId: string;
		id: string;
		name: string;
		email: string;
		avatar: string | null | undefined;
		acceptedAt: Date | null | undefined;
		invitedAt: Date | null | undefined;
		roleId: string;
		roleName: string;
	}) {
		this.projectId = data.projectId;
		this.id = data.id;
		this.name = data.name;
		this.email = data.email;
		this.avatar = data.avatar;
		this.acceptedAt = data.acceptedAt;
		this.invitedAt = data.invitedAt;
		this.roleId = data.roleId;
		this.roleName = data.roleName;
	}
}

export const GetMembersResponseDTOSchema = z.object({
	projectId: z.string(),
	id: z.string(),
	name: z.string(),
	email: z.string(),
	avatar: z.string().nullable(),
	acceptedAt: z.date().nullable(),
	invitedAt: z.date().nullable(),
	roleId: z.string(),
	roleName: z.string(),
});
