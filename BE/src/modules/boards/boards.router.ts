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

const boardsController = new BoardsController();
const listsController = new ListsController();
export const boardsRegistry = new OpenAPIRegistry();
const router = express.Router();

autoBindUtil(boardsController);
autoBindUtil(listsController);

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
export const boardsRouter = router;
