import type { IGetterDashboardGroup } from '../../../domains/adapters';
import type { IGetDashboardsUc } from '../../../domains/uce-cases';

export function GetDashboards(repo: IGetterDashboardGroup): IGetDashboardsUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			return {
				dashboardGroup,
			};
		},
	};
}
