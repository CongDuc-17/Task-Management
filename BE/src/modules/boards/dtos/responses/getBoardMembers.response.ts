import { z } from 'zod';

export class GetBoardMembersResponseDto {
	boardId: string;
	userId: string;
	name: string;
	email: string;
	avatar: string;
	roleId: string;
	roleName: string;

	constructor(data: {
		boardId: string;
		userId: string;
		name: string;
		email: string;
		avatar: string;
		roleId: string;
		roleName: string;
	}) {
		this.boardId = data.boardId;
		this.userId = data.userId;
		this.name = data.name;
		this.email = data.email;
		this.avatar = data.avatar;
		this.roleId = data.roleId;
		this.roleName = data.roleName;
	}
}

export const getBoardMembersResponseDtoSchema = z.object({
	boardId: z.string(),
	userId: z.string(),
	name: z.string(),
	email: z.string(),
	avatar: z.string(),
	roleId: z.string(),
	roleName: z.string(),
});
