import { PrismaService } from '../database/prisma.service';

export class UserRoleRepository {
	constructor(private readonly prismaService = new PrismaService()) {}
	async assignUserRole(userId: string, roleId: string) {
		return this.prismaService.usersRoles.create({
			data: {
				userId,
				roleId,
			},
		});
	}
}
2;
