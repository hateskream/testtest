import type { IWidgetPreset } from './dto';

export interface ICreateTabUc {
	execute(): Promise<IOutCreateTab>;
}

export interface IOutCreateTab {
	tabId: string;
	widgets: IWidgetPreset[];
}
