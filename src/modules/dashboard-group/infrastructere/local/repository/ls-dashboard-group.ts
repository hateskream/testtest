import { Dashboard } from '@/modules/dashboard-group/domains/entities/dashboard';
import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../../domains/adapters';
import { DashboardGroup } from '../../../domains/entities';
import { DashboardGroupSchema, type DashboardGroup as DashboardGroupModel } from '../../validate';
import { FailedParse, NotInitialized } from './error';
import { Widget } from '@/modules/dashboard-group/domains/entities/widget';

export class LSDashboardGroup implements
IGetterDashboardGroup, ISetterDashboardGroup {
	private readonly storageKey: string;
	private cached: DashboardGroup | null = null;

	constructor(storageKey: string) {
		this.storageKey = storageKey;
	}

	public init() {
		const raw = localStorage.getItem(this.storageKey);

		if (raw === null) {
			this.cached = DashboardGroup.create();
			return;
		}

		const data = this.tryParse(raw);

		this.cached = DashboardGroup
			.rehydrate(data.activeDashboardId,
				data.dashboards
					.map((d) => Dashboard
						.rehydrate(d.id, d.name, d.order, d.widgets
							.map(w => Widget
								.rehydrate(w.id, w.type, w.position),
							),
						),
					),
			);
	}

	private tryParse(raw: string): DashboardGroupModel {
		const { data, success, error } = DashboardGroupSchema.safeParse(raw);

		if (!success) {
			throw new FailedParse('Failed to parse DashboardGroup '
				+ `\nError: ${error.message}`);
		}

		return data;
	}

	public Get(): Promise<DashboardGroup> {
		if (this.cached === null) {
			throw new NotInitialized('DashboardGroup is not initialized');
		}

		return Promise.resolve(this.cached);
	}

	public Set(dashboardGroup: DashboardGroup): Promise<void> {
		const raw = JSON.stringify(dashboardGroup);

		this.tryParse(raw);
		localStorage.setItem(this.storageKey, raw);

		this.cached = dashboardGroup;

		return Promise.resolve();
	}
}
