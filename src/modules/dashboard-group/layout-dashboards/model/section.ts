import { v4 as uuidv4 } from 'uuid';

import { WidgetType } from '@/modules/dashboard-group';
import {
	createWidget,
	findDifferentWidget,
	findMovedWidget,
	findNewWidget,
	fromInfiniteToFinite,
	type DisplayVariant,
	type IWidget,
} from './widget';
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

export const HEIGHT_SECTION_TITLE = 50;
export const MIN_SECTION_WIDTH = 320;

export function changeOrderWidgets(section: ISection, widgets: IWidget[], sectionHeight: number) {
	const height = sectionHeight - HEIGHT_SECTION_TITLE;

	const newWidget = findNewWidget(section.widgets, widgets);
	if (newWidget) {
		return changeOrderWidget(section, newWidget, widgets, height);
	}

	const differentWidget = findDifferentWidget(section.widgets, widgets);
	if (differentWidget) {
		return changeOrderWidget(section, differentWidget, widgets, height);
	}

	const movedWidget = findMovedWidget(section.widgets, widgets);
	if (movedWidget) {
		return changeOrderWidget(section, movedWidget, widgets, height);
	}

	if (!widgets.length) {
		return {
			...section,
			widgets: [],
		};
	}


	return section;
}

function changeOrderWidget(section: ISection, widget: IWidget, widgets: IWidget[], sectionHeight: number) {
	if (Number.isFinite(widget.height)) {
		return { ...section, widgets };
	}

	return {
		...section,
		widgets: updateById(
			widgets,
			widget.id,
			w => fromInfiniteToFinite(w, sectionHeight),
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
