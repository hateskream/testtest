import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../domains/adapters/contract';
import type { IDeleteWidgetUc } from '../../domains/uce-cases';



export function DeleteWidget(repo: IRepository): IDeleteWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			// TODO: реализовать метод удаления виджета в DashboardGroup
			const widgetId = dashboardGroup.deleteWidget(_in.widgetId, _in.dashboardState);

			await repo.Set(dashboardGroup);

			return {
				widgetId,
			};
		},
	};
}
