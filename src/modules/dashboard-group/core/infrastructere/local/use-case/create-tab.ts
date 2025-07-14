import { PresetWidget } from '@/modules/dashboard-group/core/domains/entities/widget';
import type { IRepository } from '../../../domains/adapters';
import type { ICreateTabUc } from '../../../domains/uce-cases';
import { mapWidgetsPreset } from './mappers';


export function CreateTab(repo: IRepository): ICreateTabUc {
	return {
		async execute() {
			const dashboardGroup = await repo.Get();

			const newDashboard = dashboardGroup.createNewDashboard();

			await repo.Set(dashboardGroup);

			const widgets = PresetWidget.allWidgets();
			return {
				activeDashboardId: dashboardGroup.activeDashboardId,
				dashboard: newDashboard,
				widgets: mapWidgetsPreset(widgets),
			};
		},
	};
}
