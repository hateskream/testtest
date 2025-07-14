import type { IRepository } from '../../../domains/adapters';
import type { IAddWidgetUc } from '../../../domains/uce-cases';
import { mapWidget } from './mappers';

export function AddWidget(repo: IRepository): IAddWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const widget = dashboardGroup.addWidget(_in.widgetType, _in.position, _in.widgetsState);

			await repo.Set(dashboardGroup);

			return {
				widget: mapWidget(widget),
			};
		},
	};
}
