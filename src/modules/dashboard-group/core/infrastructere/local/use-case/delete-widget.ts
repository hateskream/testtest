import type { IRemoveWidgetPort, IRepository } from '../../../domains/adapters';
import type { IDeleteWidgetUc } from '../../../domains/uce-cases';


export function DeleteWidget(repo: IRepository, producer: IRemoveWidgetPort): IDeleteWidgetUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const widget = dashboardGroup.deleteWidget(_in.widgetId, _in.dashboardState);

			await repo.Set(dashboardGroup);

			producer.produceRemove(widget.widgetType, widget.id);

			return {
				widgetId : _in.widgetId,
			};
		},
	};
}
