import type { IRepository } from '../../../domains/adapters';
import type { WidgetType } from '../../../domains/entities/widget';
import type { IGetAllWidgetIdsUc } from '../../../domains/uce-cases';

export function GetAllWidgetIds(repo: IRepository): IGetAllWidgetIdsUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			return {
				ids: dashboardGroup.getAllWidgetIds(
					_in.widgetType as WidgetType,
				),
			};
		},
	};
}
