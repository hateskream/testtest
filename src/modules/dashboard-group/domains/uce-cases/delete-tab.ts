import type { IDashboard } from './dto';

export interface IDeleteTabUc {
	execute(in_: IInDeleteTab): Promise<IOutDeleteTab>;
}

export interface IInDeleteTab {
	tabId: string;
}

export interface IOutDeleteTab {
	activeTabId: string;
	dashboards: IDashboard[];
}
