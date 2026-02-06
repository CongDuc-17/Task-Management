import { InvitationsResponseDtoSchema } from './dtos/responses/invitation.response';

import { InvitationController } from './invitation.controller';
import { autoBindUtil, validateRequestMiddleware } from '@/common';

import authMiddleware from '@/common/middlewares/auth.middleware';
import {
	CreateInvitationRequestSchema,
	CreateInvitationRequestValidationSchema,
} from './dtos/requests/createInvitation.request';
import express from 'express';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';
import { ProjectPermissionEnum, BoardPermissionEnum } from '@/common/enums/permissions';
import {
	TokenInvitationRequestSchema,
	TokenRequestValidationSchema,
} from './dtos/requests';
import { GetProjectByIdRequestSchema } from '../projects/dtos/requests/getProjectById.request';
import { GetBoardByIdRequestSchema } from '../boards/dtos';
import { ShareLinkRequestSchema } from './dtos/requests/shareLink.request';
const invitationController = new InvitationController();

export const invitationsRegistry = new OpenAPIRegistry();
const router = express.Router({ mergeParams: true });
autoBindUtil(invitationController);

// /projects/:id

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/projects/{projectId}',
	tags: ['Invitations'],
	request: CreateInvitationRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/projects/:projectId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(CreateInvitationRequestValidationSchema),
	invitationController.inviteUserToProject,
);

// /boards/:id
invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/boards/{boardId}',
	tags: ['Invitations'],
	request: CreateInvitationRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/boards/:boardId',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.INVITE_MEMBER),
	validateRequestMiddleware(CreateInvitationRequestValidationSchema),
	invitationController.inviteUserToBoard,
);

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/projects/{projectId}/share-link',
	tags: ['Invitations'],
	request: ShareLinkRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});

router.post(
	'/projects/:projectId/share-link',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyProjectPermission(ProjectPermissionEnum.INVITE_MEMBER),
	//validateRequestMiddleware(TokenRequestValidationSchema),
	invitationController.createShareLinkForProject,
);

invitationsRegistry.registerPath({
	method: 'post',
	path: '/invitations/boards/{boardId}/share-link',
	tags: ['Invitations'],
	request: ShareLinkRequestSchema,
	responses: createApiResponse(InvitationsResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.post(
	'/boards/:boardId/share-link',
	authMiddleware.verifyAccessToken,
	authMiddleware.verifyBoardPermission(BoardPermissionEnum.INVITE_MEMBER),
	//validateRequestMiddleware(TokenRequestValidationSchema),
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
