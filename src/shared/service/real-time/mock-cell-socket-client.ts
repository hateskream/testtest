import { ColumnType, type CellByColumn, type ColumnWithoutSymbol } from '@/modules/cell';
import { type ISocketClient, type MessageCallback } from './socket-client';
import { generateAllRows, randomizeCellData } from '@/shared/mock';

type Message<T extends ColumnWithoutSymbol = ColumnWithoutSymbol> = {
	tickerId: string;
} & Partial<
	{
		[K in T]: CellByColumn<K>;
	}
>;

const IS_USE_REALTIME = false;

export class MockSocketClient implements ISocketClient {
	private callbacks: Partial<Record<ColumnType, MessageCallback<Message>[]>> = {};
	private intervalIds: number[] = [];
	private latestBatch: Partial<Record<ColumnType, Map<string, Message>>> = {};
	private batchIntervalId: number | null = null;

	connect() {
		if (IS_USE_REALTIME) {
			this.setup();
		}
	}

	subscribe<T>(event: string, callback: MessageCallback<T>) {
		if (!this.callbacks[event as ColumnType]) {
			this.callbacks[event as ColumnType] = [];
		}
		this.callbacks[event as ColumnType]?.push(callback as MessageCallback<Message>);
	}

	disconnect() {
		this.intervalIds.forEach(clearInterval);
		if (this.batchIntervalId) {
			clearInterval(this.batchIntervalId);
		}
	}

	private setup() {
		generateAllRows()
			.forEach(row => {
				const { tickerId } = row;

				Object.values(ColumnType).forEach(columnType => {
					if (columnType === ColumnType.Symbol) {
						return;
					}

					const interval = Math.floor(Math.random() * (5_000 - 1_000 + 1)) + 1_000;

					const id = setInterval(() => {
						this.queueEmit(columnType, {
							tickerId,
							[columnType]: randomizeCellData(row[columnType]),
						});
					}, interval);

					this.intervalIds.push(id);
				});
			});

		this.batchIntervalId = setInterval(() => {
			this.flushBatch();
		}, 300);
	}

	private queueEmit(event: ColumnType, data: Message) {
		if (!this.latestBatch[event]) {
			this.latestBatch[event] = new Map();
		}
		this.latestBatch[event]!.set(data.tickerId, data);
	}

	private flushBatch() {
		Object.entries(this.latestBatch).forEach(([event, tickerMap]) => {
			if (!tickerMap?.size) {
				return;
			}
			const messages = Array.from(tickerMap.values());
			this.callbacks[event as ColumnType]?.forEach(cb => {
				messages.forEach(msg => cb(msg));
			});
		});
		this.latestBatch = {};
	}
}

