import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { ListsController } from './list.controller';
import { CardsController } from '../cards/card.controller';

import { autoBindUtil, validateRequestMiddleware } from '@/common';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';

import {
	listResponseDtoSchema,
	updateListRequestParams,
	updateListRequestSchema,
	moveListRequestSchema,
} from './dtos';

import {
	cardResponseDtoSchema,
	createCardRequestSchema,
	createCardRequestValidationSchema,
} from '../cards/dtos';
import { CardPermissionEnum, ListPermissionEnum } from '@/common/enums/permissions';

const listsController = new ListsController();
const cardsController = new CardsController();
export const listsRegistry = new OpenAPIRegistry();

const router = express.Router({ mergeParams: true });
autoBindUtil(listsController);
autoBindUtil(cardsController);

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

listsRegistry.registerPath({
	method: 'get',
	path: '/lists/{listId}/cards',
	tags: ['Lists'],
	request: {
		params: createCardRequestSchema.params,
	},
	responses: createApiResponse(
		cardResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get(
	'/:listId/cards',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.GET_CARD),
	cardsController.getAllCardsByListId,
);

listsRegistry.registerPath({
	method: 'post',
	path: '/lists/{listId}/cards',
	tags: ['Lists'],
	request: createCardRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/:listId/cards',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.CREATE_CARD),
	validateRequestMiddleware(createCardRequestValidationSchema),
	cardsController.createCard,
);

export const listsRouter = router;
