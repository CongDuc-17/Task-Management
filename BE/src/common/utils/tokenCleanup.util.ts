import { PrismaService } from '../../modules/database';

const prismaService = new PrismaService();
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Xóa các token đã hết hạn từ database
 * Gọi hàm này định kỳ hoặc khi có request
 */
export async function cleanupExpiredTokens(): Promise<void> {
	try {
		const result = await prismaService.tokens.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});

		if (result.count > 0) {
			console.log(`[Token Cleanup] Deleted ${result.count} expired tokens`);
		}
	} catch (error) {
		console.error('[Token Cleanup] Error:', error);
	}
}

/**
 * Bắt đầu cleanup định kỳ (mỗi 1 giờ)
 * Nên gọi ở app.ts khi ứng dụng khởi động
 */
export function startTokenCleanupScheduler(intervalHours: number = 1): void {
	if (cleanupInterval) {
		console.warn('[Token Cleanup] Scheduler đã được bắt đầu rồi');
		return;
	}

	const intervalMs = intervalHours * 60 * 60 * 1000;
	cleanupInterval = setInterval(cleanupExpiredTokens, intervalMs);
	console.log(`[Token Cleanup] Scheduler bắt đầu (mỗi ${intervalHours} giờ)`);
}

/**
 * Dừng cleanup scheduler
 */
export function stopTokenCleanupScheduler(): void {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
		console.log('[Token Cleanup] Scheduler đã dừng');
	}
}
