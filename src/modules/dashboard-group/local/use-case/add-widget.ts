import type { IRepository } from '../../domains/adapters';
import type { IAddWidgetUc } from '../../domains/uce-cases';

export function AddWidget(repo: IRepository): IAddWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const id = dashboardGroup.addWidget(_in.widgetType, _in.position);

			await repo.Set(dashboardGroup);

			return {
				widgetId: id,
			};
		},
	};
}
