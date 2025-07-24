import { Dashboard } from '@/modules/dashboard-group/core/domains/entities/dashboard';
import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../../domains/adapters';
import { DashboardGroup } from '../../../domains/entities';
import { DashboardGroupSchema, type DashboardGroup as DashboardGroupModel } from '../../validate';
import { FailedParse, NotInitialized } from './error';
import { Widget } from '@/modules/dashboard-group/core/domains/entities/widget';
import { useStorageVersion } from '@/shared/composables/use-storage-version';

const { compareVersions, updateVersion } = useStorageVersion();

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
		if (!compareVersions()) {
			localStorage.removeItem(this.storageKey);

			updateVersion();
			this.initNew();
			return;
		}

		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			this.initNew();
			return;
		}

		const data = JSON.parse(raw) as DashboardGroupModel;
		this.cached = this.rehydrate(data);
	}

	private initNew() {
		const dashboardGroup = DashboardGroup.create();
		this.cached = dashboardGroup;
		this.Set(dashboardGroup);
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
				.map(dashboard => Dashboard
					.rehydrate(
						dashboard.id,
						dashboard.name,
						dashboard.order,
						dashboard.activeColNum,
						new Map(
							Object
								.entries(dashboard.layout)
								.map(([key, widgets]) => [
									Number(key),
									widgets
										.map(widget =>
											Widget.rehydrate(widget.id, widget.type, widget.position),
										),
								]),
						),
					),
				),
		);
	}

	private hydrate(data: DashboardGroup): DashboardGroupModel {
		const dg: DashboardGroupModel = {
			activeDashboardId: data.activeDashboardId,
			dashboards: data.dashboards
				.map(d => ({
					id: d.id,
					name: d.name,
					order: d.order,
					activeColNum: d.activeColNum,
					layout: Object
						.fromEntries(
							Array.from(d.layout.entries())
								.map(([key, widgets]) =>
									[
										key,
										widgets.map(widget => ({
											id: widget.id,
											type: widget.widgetType,
											position: widget.position,
										})),
									],
								),
						),
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
