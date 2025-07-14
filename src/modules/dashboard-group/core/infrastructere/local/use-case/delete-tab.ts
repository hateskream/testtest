import { PresetWidget } from '@/modules/dashboard-group/core/domains/entities/widget';
import type { IRepository } from '../../../domains/adapters';
import type { IDeleteTabUc } from '../../../domains/uce-cases';
import { mapDashboard, mapWidgetsPreset } from './mappers';


export function DeleteTab(repo: IRepository): IDeleteTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const dashboard = dashboardGroup.deleteDashboard(_in.tabId);

			await repo.Set(dashboardGroup);

			const widgets = PresetWidget.allWidgets();

			return {
				dashboard: mapDashboard(dashboard),
				widgets: mapWidgetsPreset(widgets),
			};
		},
	};
}
