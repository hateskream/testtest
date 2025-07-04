import type { IWidgetState } from './dto';


export interface IChangeDashboardStateUc {
	execute(in_: IInChangeDashboardState): Promise<void>;
}

export interface IInChangeDashboardState {
	dashboardState: IWidgetState[];
}
