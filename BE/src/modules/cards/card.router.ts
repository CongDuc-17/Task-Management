import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { CardsController } from './card.controller';
import { ChecklistsController } from '../checklists/checklists.controller';
import { autoBindUtil, validateRequestMiddleware } from '@/common';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import {
	addRemoveLabelRequestSchema,
	addRemoveLabelRequestValidationSchema,
	addMemberRequestSchema,
	addMemberRequestValidationSchema,
	cardResponseDtoSchema,
	getCardRequestSchema,
	getCardRequestValidationSchema,
	moveCardRequestParams,
	moveCardRequestSchema,
	moveCardRequestValidationSchema,
	updateInformationCardRequestSchema,
	updateInformationCardRequestValidationSchema,
	removeMemberRequestValidationSchema,
	removeMemberRequestSchema,
} from './dtos';

import { CardPermissionEnum } from '@/common/enums/permissions';
import {
	checklistByIdRequestSchema,
	createChecklistRequestSchema,
	createChecklistValidationSchema,
} from '../checklists/dtos/requests';
import { checklistResponseDtoSchema } from '../checklists/dtos/responses';

const cardsController = new CardsController();
const checklistsController = new ChecklistsController();
export const cardsRegistry = new OpenAPIRegistry();

const router = express.Router({ mergeParams: true });
autoBindUtil(cardsController);
autoBindUtil(checklistsController);

cardsRegistry.registerPath({
	method: 'get',
	path: '/cards/{cardId}',
	tags: ['Cards'],
	request: getCardRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.get(
	'/:cardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.GET_CARD),
	validateRequestMiddleware(getCardRequestValidationSchema),
	cardsController.getCardById,
);

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

cardsRegistry.registerPath({
	method: 'post',
	path: '/cards/{cardId}/labels',
	tags: ['Cards'],
	request: addRemoveLabelRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/:cardId/labels',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.UPDATE_CARD),
	validateRequestMiddleware(addRemoveLabelRequestValidationSchema),
	cardsController.addLabelToCard,
);

cardsRegistry.registerPath({
	method: 'delete',
	path: '/cards/{cardId}/labels/{labelId}',
	tags: ['Cards'],
	request: addRemoveLabelRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.delete(
	'/:cardId/labels/:labelId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.UPDATE_CARD),
	validateRequestMiddleware(addRemoveLabelRequestValidationSchema),
	cardsController.removeLabelFromCard,
);

cardsRegistry.registerPath({
	method: 'post',
	path: '/cards/{cardId}/members',
	tags: ['Cards'],
	request: addMemberRequestSchema,
	responses: createApiResponse(cardResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/:cardId/members',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.ASSIGN_MEMBER),
	validateRequestMiddleware(addMemberRequestValidationSchema),
	cardsController.addMemberToCard,
);

cardsRegistry.registerPath({
	method: 'delete',
	path: '/cards/{cardId}/members/{memberId}',
	tags: ['Cards'],
	request: removeMemberRequestSchema,
	responses: createApiResponse(null, 'Success', StatusCodes.OK),
});
router.delete(
	'/:cardId/members/:memberId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.UNASSIGN_MEMBER),
	validateRequestMiddleware(removeMemberRequestValidationSchema),
	cardsController.removeMemberFromCard,
);

cardsRegistry.registerPath({
	method: 'post',
	path: '/cards/{cardId}/checklists',
	tags: ['Cards'],
	request: createChecklistRequestSchema,
	responses: createApiResponse(checklistResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/:cardId/checklists',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(CardPermissionEnum.UPDATE_CARD),
	validateRequestMiddleware(createChecklistValidationSchema),
	checklistsController.createChecklist,
);

export const cardsRouter = router;
