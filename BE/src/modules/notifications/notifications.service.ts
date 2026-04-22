import { Notifications, Prisma } from '@prisma/client';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	PaginationDto,
	PaginationUtils,
} from '@/common';
import { UserInformationDto } from '@/modules/users/dtos';

import {
	GetNotificationsRequestDto,
	NotificationResponseDto,
	UnreadCountResponseDto,
} from './dtos';
import {
	NotificationEntityTypeEnum,
	NotificationTypeEnum,
} from './notifications.constants';
import { NotificationsRepository } from './notifications.repository';

interface NotifyCardAssignedInput {
	recipientUserId: string;
	actorId: string;
	actorName: string;
	cardId: string;
	cardTitle: string;
	boardId: string;
	listId: string;
}

export class NotificationsService {
	constructor(
		private readonly notificationsRepository: NotificationsRepository = new NotificationsRepository(),
	) {}

	async getMyNotifications(
		user: UserInformationDto,
		query: GetNotificationsRequestDto,
		pagination: PaginationDto,
	): Promise<HttpResponseBodySuccessDto<NotificationResponseDto[]>> {
		const paginationUtils = new PaginationUtils().extractSkipTakeFromPagination(
			pagination,
		);

		const [notifications, total] =
			await this.notificationsRepository.findManyByUserId({
				userId: user.id,
				isRead: query.isRead,
				skip: paginationUtils.skip,
				take: paginationUtils.take,
			});

		return {
			success: true,
			data: notifications.map((item) => new NotificationResponseDto(item)),
			pagination:
				paginationUtils.convertPaginationResponseDtoFromTotalRecords(total),
		};
	}

	async getMyUnreadCount(
		user: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<UnreadCountResponseDto>> {
		const count = await this.notificationsRepository.countUnreadByUserId(user.id);

		return {
			success: true,
			data: new UnreadCountResponseDto(count),
		};
	}

	async markAsRead(
		notificationId: string,
		user: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<null>> {
		const updated = await this.notificationsRepository.markAsRead(
			notificationId,
			user.id,
		);

		if (!updated) {
			throw new NotFoundException('Notification not found');
		}

		return {
			success: true,
			data: null,
		};
	}

	async markAllAsRead(
		user: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<null>> {
		await this.notificationsRepository.markAllAsRead(user.id);

		return {
			success: true,
			data: null,
		};
	}

	async notifyCardAssigned(input: NotifyCardAssignedInput): Promise<Notifications> {
		const data: Prisma.NotificationsCreateInput = {
			user: {
				connect: {
					id: input.recipientUserId,
				},
			},
			actorId: input.actorId,
			type: NotificationTypeEnum.CARD_ASSIGNED,
			title: 'You were assigned to a card',
			content: `${input.actorName} assigned you to card ${input.cardTitle}`,
			entityType: NotificationEntityTypeEnum.CARD,
			entityId: input.cardId,
			metadata: {
				boardId: input.boardId,
				listId: input.listId,
				cardId: input.cardId,
				cardTitle: input.cardTitle,
				actorName: input.actorName,
			},
		};

		const notification = await this.notificationsRepository.createOne(data);

		// Sau này chỗ này có thể emit socket:
		// await this.notificationsSocketService.emitNewNotification(
		//   input.recipientUserId,
		//   new NotificationResponseDto(notification),
		// );

		return notification;
	}
}
