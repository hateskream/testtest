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

export class MockSocketClient implements ISocketClient {
	private callbacks: Partial<Record<ColumnType, MessageCallback<Message>[]>> = {};
	private intervalIds: number[] = [];

	connect() {
		generateAllRows()
			.forEach(row => {

				const { tickerId } = row;

				Object.values(ColumnType).forEach(columnType => {
					if (columnType === ColumnType.Symbol) {
						return;
					}

					const interval = Math.floor(Math.random() * (15_000 - 1_000 + 1)) + 1_000;

					const id = setInterval(() => {
						this.emit(columnType, {
							tickerId,
							[columnType]:  randomizeCellData(row[columnType]),
						});
					}, interval);

					this.intervalIds.push(id);
				});
			});
	}

	subscribe<T>(event: string, callback: MessageCallback<T>) {
		if (!this.callbacks[event as ColumnType]) {
			this.callbacks[event as ColumnType] = [];
		}
		this.callbacks[event as ColumnType]?.push(callback as MessageCallback<Message>);
	}

	disconnect() {
		this.intervalIds.forEach(clearInterval);
	}

	private emit(event: ColumnType, data: Message) {
		if (this.callbacks[event]) {
			this.callbacks[event].forEach(cb => cb(data));
		}
	}
}
