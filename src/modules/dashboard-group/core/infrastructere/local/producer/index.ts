import { Producer } from '@/shared/service/event-bus';
import type { IWidgetProducer } from '../../../domains/adapters';

type Event = 'addWidget' | 'removeWidget';

interface IPayload {
	widgetType: string;
	widgetId: string;
}

type Events = Record<Event, IPayload>;

export class WidgetProducer implements IWidgetProducer {
	private readonly producer = new Producer<Events>(['addWidget', 'removeWidget']);

	produceRemove(widgetType: string, widgetId: string): void {
		this.producer.emit('removeWidget', {
			widgetType,
			widgetId,
		});
	}

	produceAdd(widgetType: string, widgetId: string): void {
		this.producer.emit('addWidget', {
			widgetType,
			widgetId,
		});
	}
}
