import mitt, { type Emitter } from 'mitt';

import type { EventType, Handler } from './common-types';

export class EventEmitter<
	Events extends Record<EventType, unknown>,
	Key extends keyof Events = EventType,
	Data extends Events[Key] = Events[Key],
> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static instance: EventEmitter<any>;
	private readonly emitter: Emitter<Events>;

	private constructor() {
		this.emitter = mitt<Events>();
	}

	public static getInstance<E extends Record<EventType, unknown>>(): EventEmitter<E> {
		if (!EventEmitter.instance) {
			EventEmitter.instance = new EventEmitter<E>();
		}
		return EventEmitter.instance as EventEmitter<E>;
	}

	emit(type: Key, data: Data): void {
		this.emitter.emit(type, data);
	}

	on(event: Key, handler: Handler<Data>): void {
		this.emitter.on(event, handler as Handler<unknown>);
	}

	off(event: Key, handler: Handler<Data>): void {
		this.emitter.off(event, handler as Handler<unknown>);
	}
}
