import { z } from 'zod';
export class MarkNotificationReadRequestDto {
	notificationId: string;

	constructor(notificationId: string) {
		this.notificationId = notificationId;
	}
}

export const markNotificationRequestParams = z
	.object({
		notificationId: z
			.string()
			.uuid('Invalid notification ID')
			.describe('Notification ID'),
	})
	.strict();

export const markNotificationRequestSchema = {
	params: markNotificationRequestParams,
};
