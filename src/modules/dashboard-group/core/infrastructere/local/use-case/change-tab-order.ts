import type { IRepository } from '../../../domains/adapters';
import type { IChangeTabOrderUc } from '../../../domains/uce-cases';


export function ChangeTabOrder(repo: IRepository): IChangeTabOrderUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			dashboardGroup.changeTabOrder(_in.ids);

			await repo.Set(dashboardGroup);
		},
	};
}
