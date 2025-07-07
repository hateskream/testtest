import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../domains/adapters/contract';
import type { IAddWidgetUc } from '../../domains/uce-cases';

interface IRepository extends IGetterDashboardGroup, ISetterDashboardGroup {}

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
