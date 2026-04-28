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
import {
	boardResponseDtoSchema,
	CreateBoardRequestSchema,
	NewBoardsResponseDTOSchema,
} from '../boards/dtos';
import { BoardsController } from '../boards/boards.controller';

import { GetProjectsResponseDTOSchema } from './dtos/responses/getProjects.response';
import {
	GetMembersResponseDTOSchema,
	GetProjectResponseDTOSchema,
} from './dtos/responses';
import { RemoveMemberProjectRequestSchema } from './dtos/requests/removeMember.request';
const projectsController = new ProjectsController();
const boardsController = new BoardsController();
export const projectsRegistry = new OpenAPIRegistry();
const router = express.Router({ mergeParams: true });

autoBindUtil(projectsController);
autoBindUtil(boardsController);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects',
	tags: ['Projects'],
	responses: createApiResponse(
		GetProjectsResponseDTOSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get(
	'/',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifySystemPermission(ProjectPermissionEnum.GET_PROJECT),
	projectsController.getAllProjects,
);

projectsRegistry.registerPath({
	method: 'post',
	path: '/projects',
	tags: ['Projects'],
	request: CreateProjectRequestSchema,
	responses: createApiResponse(GetProjectsResponseDTOSchema, 'Success', StatusCodes.OK),
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
	path: '/projects/{projectId}',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(GetProjectResponseDTOSchema, 'Success', StatusCodes.OK),
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
	responses: createApiResponse(GetProjectResponseDTOSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:projectId',
	authMiddleware.verifyAccessToken,

	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.UPDATE_PROJECT),
	validateRequestMiddleware(UpdateInformationRequestValidationSchema),
	projectsController.updateProject,
);

projectsRegistry.registerPath({
	method: 'patch',
	path: '/projects/{projectId}/archive',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.patch(
	'/:projectId/archive',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.ARCHIVE_PROJECT),
	projectsController.archiveProject,
);

projectsRegistry.registerPath({
	method: 'patch',
	path: '/projects/{projectId}/restore',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.patch(
	'/:projectId/restore',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.UNARCHIVE_PROJECT),
	projectsController.restoreProject,
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
	projectsController.deleteProject,
);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects/{projectId}/members',
	tags: ['Projects'],
	request: GetProjectByIdRequestSchema,
	responses: createApiResponse(
		GetMembersResponseDTOSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});

router.get(
	'/:projectId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.GET_PROJECT),
	projectsController.getProjectMembers,
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
	request: RemoveMemberProjectRequestSchema,
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
		NewBoardsResponseDTOSchema.array(),
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
