import { Dashboard } from '@/modules/dashboard-group/domains/entities/dashboard';
import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../../domains/adapters';
import { DashboardGroup } from '../../../domains/entities';
import { DashboardGroupSchema, type DashboardGroup as DashboardGroupModel } from '../../validate';
import { FailedParse, NotInitialized } from './error';
import { Widget } from '@/modules/dashboard-group/domains/entities/widget';

export interface IOptions {
	isSaveChange: boolean;
}

export class LSDashboardGroup implements
IGetterDashboardGroup, ISetterDashboardGroup {
	private readonly storageKey: string;
	private cached: DashboardGroup | null = null;

	constructor(storageKey: string, private readonly options?: IOptions) {
		this.storageKey = storageKey;
	}

	public init() {
		const raw = localStorage.getItem(this.storageKey);

		if (raw === null) {
			const dashboardGroup = DashboardGroup.create();
			this.cached = dashboardGroup;
			this.Set(dashboardGroup);
			return;
		}

		const data = JSON.parse(raw) as DashboardGroupModel;

		this.cached = this.rehydrate(data);
	}

	private check(data: DashboardGroupModel) {
		const { success, error } = DashboardGroupSchema.safeParse(data);

		if (!success) {
			throw new FailedParse('Failed to parse DashboardGroup '
				+ `\nError: ${error}`);
		}
	}

	private rehydrate(data: DashboardGroupModel): DashboardGroup {
		this.check(data);

		return DashboardGroup.rehydrate(data.activeDashboardId,
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

	private hydrate(data: DashboardGroup): DashboardGroupModel {
		const dg: DashboardGroupModel = {
			activeDashboardId: data.activeDashboardId,
			dashboards: data.dashboards.map(d => ({
				id: d.id,
				name: d.name,
				order: d.order,
				widgets: d.widgets.map(w => ({
					id: w.id,
					type: w.widgetType,
					position: w.position,
				})),
			})),
		};

		this.check(dg);

		return dg;
	}

	public Get(): Promise<DashboardGroup> {
		if (this.cached === null) {
			throw new NotInitialized('DashboardGroup is not initialized');
		}

		return Promise.resolve(this.cached);
	}

	public Set(dashboardGroup: DashboardGroup): Promise<void> {
		if (!this.options?.isSaveChange) {
			return Promise.resolve();
		}

		const hydrated = this.hydrate(dashboardGroup);

		this.cached = dashboardGroup;

		const raw = JSON.stringify(hydrated);

		localStorage.setItem(this.storageKey, raw);

		return Promise.resolve();
	}
}
