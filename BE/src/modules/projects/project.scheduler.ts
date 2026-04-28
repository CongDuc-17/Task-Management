import cron from 'node-cron';
import { ProjectsRepository } from './project.repository';

export class ProjectsScheduler {
	private projectsRepository: ProjectsRepository;

	constructor() {
		this.projectsRepository = new ProjectsRepository();
	}

	initCleanupJob() {
		cron.schedule('0 2 * * *', async () => {
			console.log('[ProjectsScheduler] 🗑️ Starting cleanup...');
			try {
				const count = await this.projectsRepository.cleanupExpiredProjects();
				console.log(`[ProjectsScheduler] ✅ Cleaned ${count} expired projects`);
			} catch (error) {
				console.error('[ProjectsScheduler] ❌ Cleanup failed:', error);
			}
		});
		console.log('[ProjectsScheduler] ✅ Cleanup job scheduled at 2 AM daily');
	}
}
