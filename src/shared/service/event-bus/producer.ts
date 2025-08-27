import type { EventType } from './common-types';
import { EventEmitter } from './event-emitter';

export class Producer<Events extends Record<EventType, unknown>> {
	private readonly emitter: EventEmitter<Events>;
	private readonly allowedEvents: Set<EventType>;

	constructor(allowedEvents: EventType[]) {
		this.allowedEvents = new Set(allowedEvents);
		this.emitter = EventEmitter.getInstance<Events>();
	}

	emit(event: EventType, data: Events[EventType]) {
		if (this.allowedEvents.has(event)) {
			this.emitter.emit(event, data);
		}
	}
}
