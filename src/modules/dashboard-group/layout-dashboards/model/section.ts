import { v4 as uuidv4 } from 'uuid';

import { WidgetType } from '@/modules/dashboard-group';
import { createWidget, type IWidget } from './widget';
export interface ISection {
	id: string;
	name: string;
	widgets: IWidget[];
}

export interface ISectionPreset {
	name: string;
	widgets: {
		widgetType: WidgetType;
		defaultState: string;
	}[];
}

export function createSectionFromPreset({ widgets, name }: ISectionPreset): ISection {
	return {
		id: uuidv4(),
		name,
		widgets: widgets.map(({ widgetType, defaultState }) => createWidget(widgetType, defaultState)),
	};
}
