export interface IChangeTabOrderUc {
	execute(in_: IInChangeTabOrder): Promise<IOutChangeTabOrder>;
}

export interface IInChangeTabOrder {
	dashboardsId: string;
	tabIds: string[];
}

export interface IOutChangeTabOrder {
	tabIds: string[];
}
