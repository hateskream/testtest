import type { IGetterDashboardGroup } from '../../domains/adapters/contract';
import type { IGetDashboardsUc } from '../../domains/uce-cases';

interface IRepository extends IGetterDashboardGroup {}

export function GetDashboards(repo: IRepository): IGetDashboardsUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			return {
				dashboardGroup,
			};
		},
	};
}
