import { NotificationResponseDto } from './dtos';
import { sendToUser } from '@/socket/socket.server';

export class NotificationsSocketService {
	emitNewNotification(userId: string, notification: NotificationResponseDto): void {
		sendToUser(userId, {
			event: 'notification:new',
			data: notification,
		});
	}

	emitUnreadCount(userId: string, count: number): void {
		sendToUser(userId, {
			event: 'notification:unread-count',
			data: { count },
		});
	}
}
