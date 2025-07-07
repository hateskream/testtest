import type { IRepository } from '../../domains/adapters/contract';
import type { IChangeDashboardStateUc } from '../../domains/uce-cases';


export function ChangeDashboardState(repo: IRepository): IChangeDashboardStateUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			dashboardGroup.changeStateWidgets(_in.dashboardState);

			await repo.Set(dashboardGroup);
		},
	};
}
