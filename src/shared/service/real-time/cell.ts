import type { CellByColumn, ColumnWithoutSymbol } from '@/modules/cell';
import { SocketClient, type ISocketClient } from './socket-client';
import { MockSocketClient } from './mock-cell-socket-client';

export type Message<T extends ColumnWithoutSymbol = ColumnWithoutSymbol> = {
	tickerId: string;
} & Partial<
	{
		[K in T]: CellByColumn<K>;
	}
>;

export type MessageCallback<T extends ColumnWithoutSymbol> = (msg: Message<T>) => void;

let countInstance = 0;

const IS_USE_MOCK = true;

export class CellUpdater {
	private readonly SocketClient: ISocketClient;
	private static instance: CellUpdater;

	private constructor() {
		this.SocketClient = IS_USE_MOCK
			? new MockSocketClient()
			: new SocketClient('');
		this.SocketClient.connect();
	}

	public static getInstance(): CellUpdater {
		countInstance += 1;

		if (!CellUpdater.instance) {
			CellUpdater.instance = new CellUpdater();
		}

		return CellUpdater.instance;
	}

	public register<T extends ColumnWithoutSymbol>(colType: T, cb: MessageCallback<T>) {
		this.SocketClient.subscribe<Message<T>>(colType, cb);
	}

	public disconnect() {
		countInstance -= 1;
		if (countInstance === 0) {
			this.SocketClient.disconnect();
		}
	}
}
