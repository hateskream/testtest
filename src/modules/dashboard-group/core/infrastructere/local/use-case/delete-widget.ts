import type { IRepository } from '../../../domains/adapters';
import type { IDeleteWidgetUc } from '../../../domains/uce-cases';


export function DeleteWidget(repo: IRepository): IDeleteWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			dashboardGroup.deleteWidget(_in.widgetId, _in.dashboardState);

			await repo.Set(dashboardGroup);

			return {
				widgetId : _in.widgetId,
			};
		},
	};
}
