import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ProjectsController } from './project.controller';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { autoBindUtil, validateRequestMiddleware } from '@/common';

import {
	CreateProjectRequestSchema,
	CreateProjectRequestValidationSchema,
} from './dtos/requests';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import { projectResponseDtoSchema } from './dtos/responses/project.response';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { BoardPermissionEnum, ProjectPermissionEnum } from '@/common/enums/permissions';
import {
	GetProjectByIdRequestSchema,
	GetProjectByIdRequestValidationSchema,
} from './dtos/requests/getProjectById.request';
import {
	UpdateInformationRequestSchema,
	UpdateInformationRequestValidationSchema,
} from './dtos/requests/updateInformation.request';
import { UpdateRoleMemberProjectRequestSchema } from './dtos/requests';
import { boardResponseDtoSchema, CreateBoardRequestSchema } from '../boards/dtos';
import { BoardsController } from '../boards/boards.controller';
import z from 'zod';
const projectsController = new ProjectsController();
const boardsController = new BoardsController();
export const projectsRegistry = new OpenAPIRegistry();
const router = express.Router({ mergeParams: true });

autoBindUtil(projectsController);
autoBindUtil(boardsController);

projectsRegistry.registerPath({
	method: 'post',
	path: '/projects',
	tags: ['Projects'],
	request: CreateProjectRequestSchema,
	responses: createApiResponse(projectResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifySystemPermission(ProjectPermissionEnum.CREATE_PROJECT),
	validateRequestMiddleware(CreateProjectRequestValidationSchema),
	projectsController.createProject,
);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects',
	tags: ['Projects'],
	responses: createApiResponse(projectResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.get(
	'/',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifySystemPermission(ProjectPermissionEnum.GET_PROJECT),
	projectsController.getAllProjects,
);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects/{projectId}',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(projectResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.get(
	'/:projectId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.GET_PROJECT),
	validateRequestMiddleware(GetProjectByIdRequestValidationSchema),
	projectsController.getProjectById,
);

projectsRegistry.registerPath({
	method: 'patch',
	path: '/projects/{projectId}',
	tags: ['Projects'],
	request: UpdateInformationRequestSchema,
	responses: createApiResponse(projectResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:projectId',
	authMiddleware.verifyAccessToken,

	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.UPDATE_PROJECT),
	validateRequestMiddleware(UpdateInformationRequestValidationSchema),
	projectsController.updateProject,
);

projectsRegistry.registerPath({
	method: 'delete',
	path: '/projects/{projectId}',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});

router.delete(
	'/:projectId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.DELETE_PROJECT),
	projectsController.archiveProject,
);

projectsRegistry.registerPath({
	method: 'patch',
	path: '/projects/{projectId}/members',
	tags: ['Projects'],
	request: UpdateRoleMemberProjectRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});

router.patch(
	'/:projectId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.UPDATE_MEMBER_ROLE),
	projectsController.changeRoleMemberProject,
);

projectsRegistry.registerPath({
	method: 'delete',
	path: '/projects/{projectId}/members',
	tags: ['Projects'],
	request: {
		params: z.object({
			projectId: z.string(),
		}),
		body: {
			description: 'Remove a member from project',
			content: {
				'application/json': {
					schema: z.object({ userId: z.string() }),
				},
			},
		},
	},
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.delete(
	'/:projectId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.REMOVE_MEMBER),
	projectsController.removeMember,
);

projectsRegistry.registerPath({
	method: 'post',
	path: '/projects/{projectId}/boards',
	tags: ['Projects'],
	request: CreateBoardRequestSchema,
	responses: createApiResponse(boardResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/:projectId/boards',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(BoardPermissionEnum.CREATE_BOARD),
	boardsController.createBoard,
);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects/{projectId}/boards',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(
		boardResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get(
	'/:projectId/boards',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(BoardPermissionEnum.GET_BOARD),
	boardsController.getBoards,
);
export const projectsRouter = router;
