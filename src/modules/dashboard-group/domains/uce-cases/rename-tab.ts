export interface IRenameTabUc {
	execute(in_: IInRenameTab): Promise<IOutRenameTab>;
}

export interface IInRenameTab {
	tabId: string;
	name: string;
}

export interface IOutRenameTab {
	tabId: string;
}
