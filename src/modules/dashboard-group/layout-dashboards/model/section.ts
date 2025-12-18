import { v4 as uuidv4 } from 'uuid';

import { WidgetType } from '@/modules/dashboard-group';
import { createWidget, findMovedWidget, type DisplayVariant, type IWidget } from './widget';
import { updateById } from '@/shared/lib';

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
		stateType?: string;
		height: number;
		defaultDisplayVariant: DisplayVariant;
		maxCountRow?: number;
	}[];
}

export interface ISectionWheelPayload {
	sectionId: string;
	passedWidgets: number;
}

export function changeOrderWidgets(section: ISection, widgets: IWidget[]) {
	const widget = findMovedWidget(section.widgets, widgets);
	if (!widget) {
		return section;
	}

	if (Number.isFinite(widget.height)) {
		return { ...section, widgets };
	}

	return {
		...section,
		widgets: updateById(
			section.widgets,
			widget.id,
			() => widget,
		),
	};
}

export function createSectionFromPreset({ widgets, name, width }: ISectionPreset): ISection {
	return {
		id: uuidv4(),
		name,
		width,
		widgets: widgets
			.map(({ widgetType, defaultState, stateType, height, maxCountRow, defaultDisplayVariant }) =>
				createWidget(widgetType, height, defaultDisplayVariant, defaultState, stateType, maxCountRow),
			)
			.filter(w => w !== null),
	};
}

export function changeWidth(section: ISection, width: number) {
	return section.width !== width ? { ...section, width } : section;
}
