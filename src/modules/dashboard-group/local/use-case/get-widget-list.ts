import type { IGetterDashboardGroup } from '../../domains/adapters';
import type { IGetWidgetListUc } from '../../domains/uce-cases';

interface IRepository extends IGetterDashboardGroup {}

export function GetWidgetList(repo: IRepository): IGetWidgetListUc {
	return {
		async execute() {
			const dashboardGroup = await repo.Get();

			// TODO: реализовать получение списка виджетов
			const widgets = dashboardGroup.getWidgetList();

			return {
				widgets,
			};
		},
	};
}
