import type { IDashboard, IWidgetPreset } from './dto';

export interface ICreateTabUc {
	execute(): Promise<IOutCreateTab>;
}

export interface IOutCreateTab {
	activeDashboardId: string;
	dashboard: IDashboard;
	widgets: IWidgetPreset[];
}
