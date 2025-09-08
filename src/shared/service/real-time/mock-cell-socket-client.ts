import { CellType, ColumnType, Trend, Magnitude, type CellByColumn } from '@/modules/cell';
import { type ISocketClient, type MessageCallback } from './socket-client';

type Message = {
	tickerId: string;
	[ColumnType.PriceCurrent]: CellByColumn<ColumnType.PriceCurrent>;
};

export class MockSocketClient implements ISocketClient {
	private callbacks: Partial<Record<ColumnType, MessageCallback<Message>[]>> = {};
	private intervalId: number | null = null;

	connect() {
		this.intervalId = setInterval(() => {
			const updatedTicker: Message = {
				tickerId: 'BTC 1',
				priceCurrent: {
					cellType: CellType.Number,
					columnType: ColumnType.PriceCurrent,
					value: (86000 + Math.random() * 2000).toFixed(2),
					trend: Trend.NEUTRAL,
					currencySymbol: '$',
					magnitude: Magnitude.TRILLION,
				},
			};

			this.emit(ColumnType.PriceCurrent, updatedTicker);
		}, 3000);

		this.intervalId = setInterval(() => {
			const updatedTicker: Message = {
				tickerId: 'AAPL 1',
				priceCurrent: {
					cellType: CellType.Number,
					columnType: ColumnType.PriceCurrent,
					value: (86000 + Math.random() * 2000).toFixed(2),
					trend: Trend.NEUTRAL,
					currencySymbol: '$',
					magnitude: Magnitude.TRILLION,
				},
			};

			this.emit(ColumnType.PriceCurrent, updatedTicker);
		}, 3000);
	}

	subscribe<T>(event: string, callback: MessageCallback<T>) {
		if (!this.callbacks[event as ColumnType]) {
			this.callbacks[event as ColumnType] = [];
		}
		this.callbacks[event as ColumnType]?.push(callback as MessageCallback<Message>);
	}

	disconnect() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.callbacks = {};
	}

	private emit(event: ColumnType, data: Message) {
		if (this.callbacks[event]) {
			this.callbacks[event].forEach(cb => cb(data));
		}
	}
}
