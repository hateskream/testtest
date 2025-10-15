export interface ISettings {
	isShowChart: boolean;
	isShowName: boolean;
	isShowDescription: boolean;
	isShowPastValues: boolean;
}

const DEFAULT_VIEW_STATE: ISettings = {
	isShowChart: true,
	isShowName: true,
	isShowDescription: true,
	isShowPastValues: true,
};

export function getDefaultViewState(): ISettings {
	return { ...DEFAULT_VIEW_STATE };
}
