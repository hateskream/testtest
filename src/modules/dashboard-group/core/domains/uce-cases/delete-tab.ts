import type { IDashboard, IWidgetPreset } from './dto';

export interface IDeleteTabUc {
	execute(in_: IInDeleteTab): Promise<IOutDeleteTab>;
}

export interface IInDeleteTab {
	tabId: string;
}

export interface IOutDeleteTab {
	dashboard: IDashboard;
	widgets: IWidgetPreset[];
}
