import { io, Socket } from 'socket.io-client';

export interface ISocketClient {
	connect(): void;
	subscribe<T>(event: string, cb: MessageCallback<T>): void;
	disconnect(): void;
}

export type MessageCallback<T = unknown> = (msg: T) => void;

export class SocketClient implements ISocketClient {
	private socket: Socket | null = null;
	private readonly url: string;

	constructor(url: string) {
		this.url = url;
	}

	connect() {
		this.socket = io(this.url);

		this.socket.on('disconnect', () => {
			this.socket = null;
		});
	}

	subscribe<T>(event: string, callback: MessageCallback<T>) {
		if (!this.socket) {
			throw new Error('Socket is not connected');
		}

		this.socket.on(event, callback);
	}

	disconnect() {
		this.socket?.disconnect();
	}
}
