import z from 'zod';

export class InvitationResponseDto {
	token: string;
	email: string;
	projectId?: string;
	boardId?: string;
	roleId: string;
	inviterId: string;

	constructor(data?: Partial<InvitationResponseDto>) {
		this.token = data?.token ?? '';
		this.email = data?.email ?? '';
		this.projectId = data?.projectId;
		this.boardId = data?.boardId;
		this.roleId = data?.roleId ?? '';
		this.inviterId = data?.inviterId ?? '';
	}
}

export const InvitationsResponseDtoSchema = z.object({
	token: z.string(),
	email: z.string().email(),
	projectId: z.string().optional(),
	boardId: z.string().optional(),
	roleId: z.string(),
	inviterId: z.string(),
});
