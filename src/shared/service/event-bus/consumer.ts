import type { EventType, Handler } from './common-types';
import { EventEmitter } from './event-emitter';

export class Consumer<Events extends Record<EventType, unknown>> {
	private readonly emitter: EventEmitter<Events>;
	private readonly allowedEvents: Set<EventType>;

	constructor(allowedEvents: EventType[]) {
		this.allowedEvents = new Set(allowedEvents);
		this.emitter = EventEmitter.getInstance<Events>();
	}

	on<EventKey extends keyof Events>(event: EventKey, handler: Handler<Events[EventKey]>) {
		if (this.allowedEvents.has(event as EventType)) {
			this.emitter.on(event as EventType, handler as Handler<unknown>);
		}
	}

	off<EventKey extends keyof Events>(event: EventKey, handler: Handler<Events[EventKey]>) {
		if (this.allowedEvents.has(event as EventType)) {
			this.emitter.off(event as EventType, handler as Handler<unknown>);
		}
	}
}
