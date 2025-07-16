import type { IDashboardGroup } from './dto';

export interface IGetDashboardsUc {
	execute(in_: IInGetDashboards): Promise<IOutGetDashboards>;
}

export interface IInGetDashboards {
	userId: string;
	colNum: number;
}

export interface IOutGetDashboards {
	dashboardGroup: IDashboardGroup;
}
