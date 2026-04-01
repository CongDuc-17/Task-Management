import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { ListsController } from './list.controller';

import { autoBindUtil, validateRequestMiddleware } from '@/common';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';

import {
	createListRequestSchema,
	createListRequestValidationSchema,
	listResponseDtoSchema,
	updateListRequestParams,
	updateListRequestSchema,
	moveListRequestSchema,
} from './dtos';
import { ListPermissionEnum } from '@/common/enums/permissions';

const listsController = new ListsController();
export const listsRegistry = new OpenAPIRegistry();

const router = express.Router({ mergeParams: true });
autoBindUtil(listsController);

listsRegistry.registerPath({
	method: 'patch',
	path: '/lists/{listId}/move',
	tags: ['Lists'],
	request: moveListRequestSchema,
	responses: createApiResponse(listResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:listId/move',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(ListPermissionEnum.MOVE_LIST),
	listsController.moveList,
);

listsRegistry.registerPath({
	method: 'patch',
	path: '/lists/{listId}/update',
	tags: ['Lists'],
	request: updateListRequestSchema,
	responses: createApiResponse(listResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:listId/update',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(ListPermissionEnum.UPDATE_LIST),
	listsController.updateList,
);

listsRegistry.registerPath({
	method: 'delete',
	path: '/lists/{listId}/delete',
	tags: ['Lists'],
	request: { params: updateListRequestParams },
	responses: createApiResponse(listResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.delete(
	'/:listId/delete',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(ListPermissionEnum.DELETE_LIST),
	listsController.deleteList,
);
export const listsRouter = router;
