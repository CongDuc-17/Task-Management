import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BoardsController } from './boards.controller';
import express from 'express';
import { autoBindUtil } from '@/common/utils/autoBind.utils';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { BoardPermissionEnum } from '@/common/enums/permissions/boardPermission.enum';

import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import {
	boardResponseDtoSchema,
	GetBoardByIdRequestSchema,
	UpdateInformationBoardRequestSchema,
} from './dtos';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import {
	createListRequestSchema,
	createListRequestValidationSchema,
	listResponseDtoSchema,
	updateListRequestParams,
} from '../lists/dtos';
import { ListsController } from '../lists/list.controller';
import { validateRequestMiddleware } from '@/common/middlewares/validationRequest.middleware';
import { ListPermissionEnum } from '@/common/enums/permissions';
import { UpdateRoleMemberBoardRequestSchema } from './dtos/requests/updateRoleMember.request';

import z from 'zod';
import {
	createLabelRequestSchema,
	createLabelRequestValidationSchema,
} from '../labels/dtos/requests';
import { LabelResponseDtoSchema } from '../labels/dtos/responses';
import { LabelsController } from '../labels/labels.controller';

const boardsController = new BoardsController();
const listsController = new ListsController();
const labelsController = new LabelsController();
export const boardsRegistry = new OpenAPIRegistry();
const router = express.Router();

autoBindUtil(boardsController);
autoBindUtil(listsController);
autoBindUtil(labelsController);

boardsRegistry.registerPath({
	method: 'get',
	path: '/boards/{boardId}',
	tags: ['Boards'],
	request: GetBoardByIdRequestSchema,
	responses: createApiResponse(boardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.get(
	'/:boardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.GET_BOARD),
	boardsController.getBoardById,
);

boardsRegistry.registerPath({
	method: 'patch',
	path: '/boards/{boardId}',
	tags: ['Boards'],
	request: UpdateInformationBoardRequestSchema,
	responses: createApiResponse(boardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.patch(
	'/:boardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.UPDATE_BOARD),
	boardsController.updateBoardInformation,
);
boardsRegistry.registerPath({
	method: 'delete',
	path: '/boards/{boardId}',
	tags: ['Boards'],
	request: GetBoardByIdRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.delete(
	'/:boardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.DELETE_BOARD),
	boardsController.archiveBoard,
);

boardsRegistry.registerPath({
	method: 'patch',
	path: '/boards/{boardId}/members',
	tags: ['Boards'],
	request: UpdateRoleMemberBoardRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});

router.patch(
	'/:boardId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.UPDATE_MEMBER_ROLE),
	boardsController.changeRoleOfMemberBoard,
);

boardsRegistry.registerPath({
	method: 'delete',
	path: '/boards/{boardId}/members',
	tags: ['Boards'],
	request: {
		params: z.object({
			boardId: z.string(),
		}),
		body: {
			description: 'Remove a member from board',
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
	'/:boardId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.REMOVE_MEMBER),
	boardsController.removeMember,
);

boardsRegistry.registerPath({
	method: 'get',
	path: '/boards/{boardId}/lists',
	tags: ['Boards'],
	request: GetBoardByIdRequestSchema,
	responses: createApiResponse(
		listResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});

router.get(
	'/:boardId/lists',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(ListPermissionEnum.GET_LIST),
	listsController.getAllListsByBoardId,
);

boardsRegistry.registerPath({
	method: 'post',
	path: '/boards/{boardId}/lists',
	tags: ['Boards'],
	request: createListRequestSchema,
	responses: createApiResponse(listResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/:boardId/lists',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(ListPermissionEnum.CREATE_LIST),
	listsController.createList,
);

boardsRegistry.registerPath({
	method: 'get',
	path: '/boards/{boardId}/labels',
	tags: ['Boards'],
	request: GetBoardByIdRequestSchema,
	responses: createApiResponse(
		LabelResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get(
	'/:boardId/labels',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.GET_BOARD),
	labelsController.getLabelsByBoardId,
);

boardsRegistry.registerPath({
	method: 'post',
	path: '/boards/{boardId}/labels',
	tags: ['Boards'],
	request: createLabelRequestSchema,
	responses: createApiResponse(LabelResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/:boardId/labels',
	authMiddleware.verifyAccessToken,
	validateRequestMiddleware(createLabelRequestValidationSchema),
	labelsController.createLabel,
);

export const boardsRouter = router;
