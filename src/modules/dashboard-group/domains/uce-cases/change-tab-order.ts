export interface IChangeTabOrderUc {
	execute(in_: IInChangeTabOrder): Promise<void>;
}

export interface IInChangeTabOrder {
	ids: string[];
}
