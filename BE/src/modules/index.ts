import { authRegistry, authRouter } from './auth/auth.router';
import { healthCheckRegistry, healthCheckRouter } from './healthCheck/healthCheck.router';
import { projectsRegistry, projectsRouter } from './projects/project.router';
import { usersRegistry, usersRouter } from './users/users.router';
import { boardsRegistry, boardsRouter } from './boards/boards.router';
import { listsRegistry, listsRouter } from './lists/list.router';
export const Registries = [
	healthCheckRegistry,
	authRegistry,
	usersRegistry,
	projectsRegistry,
	boardsRegistry,
	listsRegistry,
];

export const Modules = {
	healthCheckRouter,
	authRouter,
	usersRouter,
	projectsRouter,
	boardsRouter,
	listsRouter,
};
