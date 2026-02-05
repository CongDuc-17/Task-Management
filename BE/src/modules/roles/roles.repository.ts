import { PrismaService } from '../database';

export class RolesRepository {
	constructor(private readonly prismaService = new PrismaService()) {}
	async findRoleIdByUserId(userId: string) {
		const userRole = await this.prismaService.usersRoles.findFirst({
			where: { userId },
		});
		return userRole?.roleId;
	}
	async findByName(roleName: string) {
		return this.prismaService.roles.findFirst({
			where: { name: roleName, deletedAt: null },
		});
	}

	async findById(roleId: string) {
		return this.prismaService.roles.findUnique({
			where: { id: roleId, deletedAt: null },
		});
	}

	async getAllRoles() {
		return this.prismaService.roles.findMany({
			where: { deletedAt: null },
		});
	}
}
