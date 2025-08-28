import type { IAddWidgetPort, IRepository } from '../../../domains/adapters';
import type { IAddWidgetUc } from '../../../domains/uce-cases';
import { mapWidget } from './mappers';

export function AddWidget(repo: IRepository, producer: IAddWidgetPort): IAddWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const widget = dashboardGroup.addWidget(_in.widgetType, _in.position, _in.widgetsState);

			await repo.Set(dashboardGroup);

			producer.produceAdd(widget.widgetType, widget.id);
			return {
				widget: mapWidget(widget),
			};
		},
	};
}
