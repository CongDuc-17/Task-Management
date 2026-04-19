import { InvitationsResponseDtoSchema } from './dtos/responses/invitation.response';

import { InvitationController } from './invitation.controller';
import { autoBindUtil, validateRequestMiddleware } from '@/common';

import authMiddleware from '@/common/middlewares/auth.middleware';
import {
	CreateInvitationRequestSchema,
	CreateInvitationRequestValidationSchemaProject,
	CreateInvitationRequestValidationSchemaBoard,
} from './dtos/requests/createInvitation.request';
import express from 'express';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import { ProjectPermissionEnum, BoardPermissionEnum } from '@/common/enums/permissions';
import {
	TokenInvitationRequestSchema,
	TokenRequestValidationSchema,
	ShareLinkRequestValidationSchemaProject,
	ShareLinkRequestValidationSchemaBoard,
	ShareLinkRequestSchemaProject,
	ShareLinkRequestSchemaBoard,
} from './dtos/requests';
const invitationController = new InvitationController();

export const invitationsRegistry = new OpenAPIRegistry();
const router = express.Router({ mergeParams: true });
autoBindUtil(invitationController);

// /projects/:id

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/projects/{projectId}',
	tags: ['Invitations'],
	request: CreateInvitationRequestSchema('project'),
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/projects/:projectId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(CreateInvitationRequestValidationSchemaProject),
	invitationController.inviteUserToProject,
);

// /boards/:id
invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/boards/{boardId}',
	tags: ['Invitations'],
	request: CreateInvitationRequestSchema('board'),
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/boards/:boardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(CreateInvitationRequestValidationSchemaBoard),
	invitationController.inviteUserToBoard,
);

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/projects/{projectId}/share-link',
	tags: ['Invitations'],
	request: ShareLinkRequestSchemaProject,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/projects/:projectId/share-link',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(ShareLinkRequestValidationSchemaProject),
	invitationController.createShareLinkForProject,
);

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/boards/{boardId}/share-link',
	tags: ['Invitations'],
	request: ShareLinkRequestSchemaBoard,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/boards/:boardId/share-link',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(ShareLinkRequestValidationSchemaBoard),
	invitationController.createShareLinkForBoard,
);

// /invitations/:token/accept
invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/{token}/accept',
	tags: ['Invitations'],
	request: TokenInvitationRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/:token/accept',
	authMiddleware.verifyAccessToken,
	validateRequestMiddleware(TokenRequestValidationSchema),
	invitationController.acceptInvitation,
);

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/{token}/reject',
	tags: ['Invitations'],
	request: TokenInvitationRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/:token/reject',
	authMiddleware.verifyAccessToken,
	validateRequestMiddleware(TokenRequestValidationSchema),
	invitationController.rejectInvitation,
);

// router.get('/:token', invitationController.getInvitationInfo);

export const invitationsRouter = router;
