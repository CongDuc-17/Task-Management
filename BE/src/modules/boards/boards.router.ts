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

const boardsController = new BoardsController();
export const boardsRegistry = new OpenAPIRegistry();
const router = express.Router();

autoBindUtil(boardsController);

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
export const boardsRouter = router;
