export enum NotificationTypeEnum {
	BOARD_INVITED = 'BOARD_INVITED',
	PROJECT_INVITED = 'PROJECT_INVITED',
	CARD_ASSIGNED = 'CARD_ASSIGNED',
	CARD_COMMENTED = 'CARD_COMMENTED',
	CARD_DUE_SOON = 'CARD_DUE_SOON',
}

export enum NotificationEntityTypeEnum {
	PROJECT = 'PROJECT',
	BOARD = 'BOARD',
	CARD = 'CARD',
	INVITATION = 'INVITATION',
}

export const NotificationSocketEvents = {
	NEW: 'notification:new',
	UNREAD_COUNT: 'notification:unread-count',
} as const;
