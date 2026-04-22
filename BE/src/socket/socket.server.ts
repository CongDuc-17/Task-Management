import { IncomingMessage, Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UserStatusEnum } from '@prisma/client';

import { jwtConfig } from '@/configs';
import { UsersRepository } from '@/modules/users/users.repository';

type AuthenticatedSocket = WebSocket & {
	userId?: string;
};

type WsEventPayload = {
	event: string;
	data: unknown;
};

type JwtPayload = {
	userId: string;
	iat?: number;
	exp?: number;
};

let wss: WebSocketServer | null = null;
const userConnections = new Map<string, Set<AuthenticatedSocket>>();

const normalizeToken = (token?: string | null): string | null => {
	if (!token) return null;
	return token.trim().replace(/\r|\n/g, '');
};

const extractAccessTokenFromRequest = (req: IncomingMessage): string | null => {
	//C1: Lấy token từ cookie
	const cookieHeader = req.headers.cookie;
	if (cookieHeader) {
		const accessToken = cookieHeader
			.split('; ')
			.find((row) => row.startsWith('accessToken='))
			?.split('=')[1];

		const normalizedCookieToken = normalizeToken(accessToken);
		if (normalizedCookieToken) return normalizedCookieToken;
	}

	//C2: Lấy token từ query parameters (dự phòng)
	const url = new URL(req.url || '', 'http://localhost');
	const queryToken =
		url.searchParams.get('accessToken') || url.searchParams.get('token');
	// Ví dụ: ws://localhost:8080/ws?accessToken=abc123xyz
	return normalizeToken(queryToken);
};

const addUserConnection = (userId: string, socket: AuthenticatedSocket): void => {
	const sockets = userConnections.get(userId) ?? new Set<AuthenticatedSocket>();
	sockets.add(socket);
	userConnections.set(userId, sockets);
	console.log(`[ws] user ${userId} connected, total sockets: ${sockets.size}`);
};

const removeUserConnection = (
	userId: string | undefined,
	socket: AuthenticatedSocket,
): void => {
	if (!userId) return;

	const sockets = userConnections.get(userId);
	if (!sockets) return;

	sockets.delete(socket);

	if (sockets.size === 0) {
		userConnections.delete(userId);
		console.log(`[ws] user ${userId} disconnected, no active sockets left`);
		return;
	}

	console.log(`[ws] user ${userId} disconnected, remaining sockets: ${sockets.size}`);
};

const sendJson = (socket: WebSocket, payload: WsEventPayload): void => {
	if (socket.readyState !== WebSocket.OPEN) return;
	socket.send(JSON.stringify(payload));
};

export const createWebSocketServer = (server: HttpServer): WebSocketServer => {
	const usersRepository = new UsersRepository();

	wss = new WebSocketServer({
		server,
		path: '/ws',
	});

	wss.on('connection', async (socket: AuthenticatedSocket, req: IncomingMessage) => {
		console.log('[ws] incoming connection');
		console.log('[ws] req.url:', req.url);

		try {
			const accessToken = extractAccessTokenFromRequest(req);
			console.log('[ws] extracted accessToken:', accessToken);

			if (!accessToken) {
				console.log('[ws] missing access token');
				socket.close(1008, 'Unauthorized');
				return;
			}

			const payload = verify(
				accessToken,
				jwtConfig.secretAccessToken,
			) as JwtPayload;
			console.log('[ws] jwt payload:', payload);

			if (!payload?.userId) {
				console.log('[ws] payload missing userId');
				socket.close(1008, 'Unauthorized');
				return;
			}

			const user = await usersRepository.findUser({
				userId: payload.userId,
				userStatus: UserStatusEnum.ACTIVE,
			});
			console.log(
				'[ws] db user:',
				user ? { id: user.id, email: user.email } : null,
			);

			if (!user) {
				console.log('[ws] user not found or inactive');
				socket.close(1008, 'Unauthorized');
				return;
			}

			socket.userId = user.id;
			addUserConnection(user.id, socket);

			sendJson(socket, {
				event: 'connection:success',
				data: {
					userId: user.id,
				},
			});

			socket.on('message', (message) => {
				try {
					const parsed = JSON.parse(message.toString());
					console.log('[ws] client message:', parsed);
				} catch (error) {
					console.log('[ws] invalid client message:', message.toString());
					sendJson(socket, {
						event: 'error',
						data: {
							message: 'Invalid JSON message',
						},
					});
				}
			});

			socket.on('close', (code, reason) => {
				console.log('[ws] socket closed:', code, reason.toString());
				removeUserConnection(socket.userId, socket);
			});

			socket.on('error', (error) => {
				console.log('[ws] socket error:', error);
				removeUserConnection(socket.userId, socket);
			});
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				console.log('[ws] token expired:', error.message);
			} else if (error instanceof JsonWebTokenError) {
				console.log('[ws] invalid jwt:', error.message);
			} else {
				console.log('[ws] unexpected auth error:', error);
			}

			socket.close(1008, 'Unauthorized');
		}
	});

	console.log('[ws] server initialized at path /ws');
	return wss;
};

export const sendToUser = (userId: string, payload: WsEventPayload): void => {
	const sockets = userConnections.get(userId);
	if (!sockets || sockets.size === 0) {
		console.log(`[ws] no active socket for user ${userId}`);
		return;
	}

	const message = JSON.stringify(payload);

	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(message);
		}
	}
};

export const getWebSocketServer = (): WebSocketServer => {
	if (!wss) {
		throw new Error('WebSocket server has not been initialized');
	}
	return wss;
};
