export class GetNotificationsRequestDto {
	isRead?: boolean;

	constructor(query: Record<string, unknown>) {
		if (query.isRead !== undefined) {
			this.isRead = query.isRead === 'true';
		}
	}
}
