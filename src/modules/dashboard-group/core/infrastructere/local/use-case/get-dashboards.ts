import type { IRepository } from '../../../domains/adapters';
import type { IGetDashboardsUc } from '../../../domains/uce-cases';
import { mapDashboards } from './mappers';

export function GetDashboards(repo: IRepository): IGetDashboardsUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			return {
				dashboardGroup: {
					dashboards: mapDashboards(dashboardGroup.getDashboardsByColNum(_in.colNum)),
					activeDashboardId: dashboardGroup.activeDashboardId,
				},
			};
		},
	};
}
