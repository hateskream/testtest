import type { EventType, Handler } from './common-types';
import { EventEmitter } from './event-emitter';

export class Consumer<Events extends Record<EventType, unknown>> {
	private readonly emitter: EventEmitter<Events>;
	private readonly allowedEvents: Set<EventType>;

	constructor(allowedEvents: EventType[]) {
		this.allowedEvents = new Set(allowedEvents);
		this.emitter = EventEmitter.getInstance<Events>();
	}

	on(event: EventType, handler: Handler<Events[EventType]>) {
		if (this.allowedEvents.has(event)) {
			this.emitter.on(event, handler);
		}
	}

	off(event: EventType, handler: Handler<Events[EventType]>) {
		if (this.allowedEvents.has(event)) {
			this.emitter.off(event, handler);
		}
	}
}
