export enum NotificationTypeEnum {
	CARD_ASSIGNED = 'CARD_ASSIGNED',
}

export enum NotificationEntityTypeEnum {
	CARD = 'CARD',
}

export const NotificationSocketEvents = {
	NEW: 'notification:new',
	UNREAD_COUNT: 'notification:unread-count',
} as const;
