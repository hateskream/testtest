import type { IDashboard } from './dto';

export interface IChangeActiveTabUc {
	execute(in_: IInChangeActiveTab): Promise<IOutChangeActiveTab>;
}

export interface IInChangeActiveTab {
	tabId: string;
}

export interface IOutChangeActiveTab {
	activeTabId: string;
	dashboard: IDashboard;
}
