import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { CardsController } from './card.controller';

import { autoBindUtil, validateRequestMiddleware } from '@/common';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import {
	cardResponseDtoSchema,
	moveCardRequestParams,
	moveCardRequestSchema,
	moveCardRequestValidationSchema,
	updateInformationCardRequestSchema,
	updateInformationCardRequestValidationSchema,
} from './dtos';

import { CardPermissionEnum } from '@/common/enums/permissions';

const cardsController = new CardsController();
export const cardsRegistry = new OpenAPIRegistry();

const router = express.Router({ mergeParams: true });
autoBindUtil(cardsController);

cardsRegistry.registerPath({
	method: 'patch',
	path: '/cards/{cardId}/move',
	tags: ['Cards'],
	request: moveCardRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:cardId/move',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.MOVE_CARD),
	validateRequestMiddleware(moveCardRequestValidationSchema),
	cardsController.moveCard,
);

cardsRegistry.registerPath({
	method: 'patch',
	path: '/cards/{cardId}/update-information',
	tags: ['Cards'],
	request: updateInformationCardRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.patch(
	'/:cardId/update-information',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.UPDATE_CARD),
	//validateRequestMiddleware(updateInformationCardRequestValidationSchema),
	cardsController.updateInformationCard,
);

cardsRegistry.registerPath({
	method: 'delete',
	path: '/cards/{cardId}',
	tags: ['Cards'],
	request: {
		params: moveCardRequestParams,
	},
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.delete(
	'/:cardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.DELETE_CARD),
	cardsController.softDeleteCard,
);

export const cardsRouter = router;
