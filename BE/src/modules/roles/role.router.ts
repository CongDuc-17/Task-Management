import { autoBindUtil } from '@/common';
import express from 'express';
import { RoleController } from './role.controller';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { roleResponseDtoSchema } from './dtos';
const rolesController = new RoleController();
export const rolesRegistry = new OpenAPIRegistry();
const router = express.Router({ mergeParams: true });
autoBindUtil(rolesController);

rolesRegistry.registerPath({
	method: 'get',
	path: '/roles',
	tags: ['Roles'],
	responses: createApiResponse(
		roleResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get('/', rolesController.getAllRoles);

export const rolesRouter = router;
