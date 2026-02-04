import { PrismaClient } from '@prisma/client';
import {
	AdminPermissionEnum,
	UserPermissionEnum,
	ProjectPermissionEnum,
	BoardPermissionEnum,
	ListPermissionEnum,
	CardPermissionEnum,
} from '../../common/enums/permissions';

import { UserRoleEnum, ProjectRoleEnum, BoardRoleEnum } from '../../common/enums/roles';

const prisma = new PrismaClient();

function enumValues<T extends Record<string, string>>(e: T): string[] {
	return Object.values(e);
}

async function seedRoles() {
	console.log('Seeding roles...');
	const allRoles = [
		...Object.values(UserRoleEnum),
		...Object.values(ProjectRoleEnum),
		...Object.values(BoardRoleEnum),
	];
	// Check existing roles
	const existingRoles = await prisma.roles.findMany({
		where: {
			name: { in: allRoles },
			deletedAt: null,
		},
		select: { name: true },
	});

	const existingRoleNames = existingRoles.map((role) => role.name);

	// Filter roles that need to be created
	const rolesToCreate = allRoles.filter((name) => !existingRoleNames.includes(name));
	if (rolesToCreate.length > 0) {
		await prisma.roles.createMany({
			data: rolesToCreate.map((name) => ({
				name,
				description: `Role ${name}`,
				
			})),
			skipDuplicates: true,
		});
		console.log(`Seeded ${rolesToCreate.length} roles.`);
	} else {
		console.log('No new roles to seed.');
	}
}

async function seedPermissions() {
	console.log('Seeding permissions...');
	const allPermissions = [
		...enumValues(AdminPermissionEnum),
		...enumValues(UserPermissionEnum),
		...enumValues(ProjectPermissionEnum),
		...enumValues(BoardPermissionEnum),
		...enumValues(ListPermissionEnum),
		...enumValues(CardPermissionEnum),
	];

	const existingPermissions = await prisma.permissions.findMany({
		where: {
			name: { in: allPermissions },
			deletedAt: null,
		},
		select: { name: true },
	});

	const existingPermissionNames = existingPermissions.map((perm) => perm.name);
	const permissionsToCreate = allPermissions.filter(
		(name) => !existingPermissionNames.includes(name),
	);

	if (permissionsToCreate.length > 0) {
		await prisma.permissions.createMany({
			data: permissionsToCreate.map((name) => ({
				name,
				description: `Permission ${name}`,
			})),
			skipDuplicates: true,
		});
		console.log(`Seeded ${permissionsToCreate.length} permissions.`);
	} else {
		console.log('No new permissions to seed.');
	}
}

async function seedRolePermissions() {
	console.log('Seeding role-permission associations...');
	// Define role-permission mappings
	const rolePermissionMapping: Record<string, string[]> = {
		[UserRoleEnum.ADMIN]: [
			...enumValues(AdminPermissionEnum),
			...enumValues(UserPermissionEnum),
			...enumValues(ProjectPermissionEnum),
			...enumValues(BoardPermissionEnum),
			...enumValues(ListPermissionEnum),
			...enumValues(CardPermissionEnum),
		],
		[UserRoleEnum.USER]: [
			ProjectPermissionEnum.CREATE_PROJECT,
			ProjectPermissionEnum.GET_PROJECT,
		],

		[ProjectRoleEnum.PROJECT_ADMIN]: [
			...enumValues(ProjectPermissionEnum),
			...enumValues(BoardPermissionEnum),
			...enumValues(ListPermissionEnum),
			...enumValues(CardPermissionEnum),
		],

		[ProjectRoleEnum.PROJECT_MEMBER]: [
			ProjectPermissionEnum.GET_PROJECT,
			ProjectPermissionEnum.CREATE_PROJECT,
			ProjectPermissionEnum.INVITE_MEMBER,
			BoardPermissionEnum.CREATE_BOARD,
			BoardPermissionEnum.GET_BOARD,
			...enumValues(ListPermissionEnum),
			...enumValues(CardPermissionEnum),
		],
		[ProjectRoleEnum.PROJECT_VIEWER]: [
			ProjectPermissionEnum.GET_PROJECT,
			BoardPermissionEnum.GET_BOARD,
			ListPermissionEnum.GET_LIST,
			CardPermissionEnum.GET_CARD,
		],

		[BoardRoleEnum.BOARD_ADMIN]: [
			...enumValues(BoardPermissionEnum),
			...enumValues(ListPermissionEnum),
			...enumValues(CardPermissionEnum),
		],
		[BoardRoleEnum.BOARD_MEMBER]: [
			BoardPermissionEnum.GET_BOARD,
			BoardPermissionEnum.INVITE_MEMBER,
			...enumValues(ListPermissionEnum),
			...enumValues(CardPermissionEnum),
		],
		[BoardRoleEnum.BOARD_VIEWER]: [
			BoardPermissionEnum.GET_BOARD,
			ListPermissionEnum.GET_LIST,
			CardPermissionEnum.GET_CARD,
		],
	};

	// Fetch existing roles and permissions
	const roleRecords = await prisma.roles.findMany({
		where: { deletedAt: null },
		select: { id: true, name: true },
	});

	const permissionRecords = await prisma.permissions.findMany({
		where: { deletedAt: null },
		select: { id: true, name: true },
	});

	// Create maps for easy lookup
	const rolesMap = new Map(roleRecords.map((role) => [role.name, role.id]));
	const permissionsMap = new Map(permissionRecords.map((perm) => [perm.name, perm.id]));

	const existingRolePermissions = await prisma.rolesPermissions.findMany({
		select: { roleId: true, permissionId: true },
	});

	// Create a set of existing role-permission combinations for quick lookup
	const existingRolePermissionSet = new Set(
		existingRolePermissions.map((rp) => `${rp.roleId}-${rp.permissionId}`),
	);

	// Prepare new role-permission associations to create
	const rolePermissionsToCreate: Array<{ roleId: string; permissionId: string }> = [];
	for (const [roleName, permissionNames] of Object.entries(rolePermissionMapping)) {
		const roleId = rolesMap.get(roleName);
		if (!roleId) continue;
		for (const permName of permissionNames) {
			const permId = permissionsMap.get(permName);
			if (!permId) continue;
			const key = `${roleId}-${permId}`;
			if (!existingRolePermissionSet.has(key)) {
				rolePermissionsToCreate.push({ roleId, permissionId: permId });
			}
		}
	}
	if (rolePermissionsToCreate.length > 0) {
		await prisma.rolesPermissions.createMany({
			data: rolePermissionsToCreate,
			skipDuplicates: true,
		});
		console.log(
			`Seeded ${rolePermissionsToCreate.length} role-permission associations.`,
		);
	} else {
		console.log('No new role-permission associations to seed.');
	}
}

async function main() {
	try {
		console.log('Starting seeding process...');
		await seedRoles();
		await seedPermissions();
		await seedRolePermissions();
		console.log('Seeding process completed.');
	} catch (error) {
		console.error('Error during seeding process:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error('Unhandled error in seeding script:', error);
	process.exit(1);
});
