import type { IWidgetPreset } from './dto';

export interface IOutGetWidgetList {
	widgets: IWidgetPreset[];
}

export interface IGetWidgetListUc {
	execute(): Promise<IOutGetWidgetList>;
}
