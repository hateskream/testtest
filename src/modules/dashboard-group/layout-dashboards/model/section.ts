import { v4 as uuidv4 } from 'uuid';

import { WidgetType } from '@/modules/dashboard-group';
import { createWidget, type DisplayVariant, type IWidget } from './widget';
export interface ISection {
	id: string;
	name: string;
	width: number;
	widgets: IWidget[];
}

export interface ISectionPreset {
	name: string;
	width: number;
	widgets: {
		widgetType: WidgetType;
		defaultState: string;
		height: number;
		defaultDisplayVariant: DisplayVariant;
		maxCountRow?: number;
	}[];
}

export interface ISectionWheelPayload {
	sectionId: string;
	passedWidgets: number;
}

export function createSectionFromPreset({ widgets, name, width }: ISectionPreset): ISection {
	return {
		id: uuidv4(),
		name,
		width,
		widgets: widgets
			.map(({ widgetType, defaultState, height, maxCountRow, defaultDisplayVariant }) =>
				createWidget(widgetType, height, defaultDisplayVariant, defaultState, maxCountRow),
			)
			.filter(w => w !== null),
	};
}
