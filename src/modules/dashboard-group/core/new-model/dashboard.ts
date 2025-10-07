import { v4 as uuidv4 } from 'uuid';

import {
	createWidget,
	FEATURE_TO_WIDGET_TYPE,
	type IPosition,
	type IWidget,
	type IWidgetState,
	type WidgetType,
} from './widget';
import { getAllEnableWidgets } from '@/shared/lib/feature-toggle';
import { NAME_TO_PRESET, type PresetName } from './dashbord-presets';

type Layout = Map<number, IWidget[]>;

export interface IDashboardPrivate {
	id: string;
	name: string;
	order: number;
	activeColNum: number;
	layout: Layout;
}

export interface IDashboard {
	id: string;
	name: string;
	order: number;
	widgets: IWidget[];
}

export function fromInnerToPublicDashboard(dashboard: IDashboardPrivate): IDashboard {
	return {
		...dashboard,
		widgets: getWidgets(dashboard),
	};
}

// Lazy initialization of enabled widgets to avoid circular dependency issues
let enableWidgets: Set<WidgetType> | null = null;

function getEnabledWidgets(): Set<WidgetType> {
	if (enableWidgets === null) {
		enableWidgets = new Set(
			getAllEnableWidgets()
				.map(feature => FEATURE_TO_WIDGET_TYPE[feature]),
		);
	}
	return enableWidgets;
}

function getWidgets(dashboard: IDashboardPrivate): IWidget[] {
	return dashboard.layout.get(dashboard.activeColNum) || [];
}

function setWidgets(dashboard: IDashboardPrivate, widgets: IWidget[]): IDashboardPrivate {
	return {
		...dashboard,
		layout: new Map(dashboard.layout.set(dashboard.activeColNum, widgets)),
	};
}

export function setActiveColumn(dashboard: IDashboardPrivate, activeColNum: number): IDashboardPrivate {
	if (dashboard.activeColNum === activeColNum) {
		return dashboard;
	}

	const activeColWidgets = dashboard.layout.get(activeColNum) || [];

	const seen = new Set<string>();
	const uniqueWidgets = activeColWidgets.filter(widget => {
		const key = widget.id;
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});

	return {
		...setWidgets(dashboard, uniqueWidgets),
		activeColNum,
	};
}

export function getAllWidgetIds(dashboard: IDashboardPrivate, type: WidgetType): string[] {
	return getWidgets(dashboard)
		.filter(widget => widget.widgetType === type)
		.map(widget => widget.id);
}

export function changeWidgetsState(dashboard: IDashboardPrivate, widgetsState: IWidgetState[]): IDashboardPrivate {
	const widgets = getWidgets(dashboard);

	widgets.forEach(widget => {
		const widgetState = widgetsState.find(w => w.id === widget.id);
		if (widgetState) {
			widget.position = widgetState.position;
		}
	});

	return setWidgets(dashboard, widgets);
}

export function deleteWidget(
	dashboard: IDashboardPrivate,
	widgetId: string,
	widgetsState: IWidgetState[],
): IDashboardPrivate {
	const { layout } = dashboard;

	layout.forEach((widgets, key) => {
		const updatedWidgets = widgets.filter(w => w.id !== widgetId);
		layout.set(key, updatedWidgets);
	});

	return changeWidgetsState(
		{
			...dashboard,
			layout: new Map(layout),
		},
		widgetsState,
	);
}

export function addWidget(
	dashboard: IDashboardPrivate,
	widgetType: string,
	position: IPosition,
	widgetsState: IWidgetState[],
): IDashboardPrivate {
	const widget = createWidget(widgetType, position);

	const { layout } = dashboard;

	layout.forEach(widgets => {
		widgets.push(widget);
	});

	return changeWidgetsState(
		{
			...dashboard,
			layout: new Map(layout),
		},
		widgetsState,
	);
}

function createDashboard(
	name: string,
	order: number,
	activeColNum: number,
	layout: Layout,
): IDashboardPrivate {
	return {
		id: uuidv4(),
		name,
		order,
		activeColNum,
		layout,
	};
}

export function createEmptyDashboard(order: number, activeColNum: number): IDashboardPrivate {
	const layout = new Map();
	layout.set(activeColNum, []);

	return createDashboard('Dashboard', order, activeColNum, layout);
}

export function createDashboardFromPreset(presetName: PresetName, order: number, colNum: number): IDashboardPrivate {
	const preset = NAME_TO_PRESET()[presetName];
	const layout = new Map<number, IWidget[]>();

	Object.entries(preset).forEach(([cn, instances]) => {
		const widgets = instances
			.filter(instance => getEnabledWidgets().has(instance.type))
			.map(instance => {
				return createWidget(
					instance.type,
					{
						x: instance.position.x,
						y: instance.position.y,
						w: instance.position.size.w,
						h: instance.position.size.h,
					},
					instance.defaultStateType,
				);
			});

		if (widgets.length > 0) {
			layout.set(Number(cn), widgets);
		}
	});

	return createDashboard(presetName, order, colNum, layout);
}

function rehydrateDashboard(
	id: string,
	name: string,
	order: number,
	activeColNum: number,
	layout: Layout,
): IDashboardPrivate {
	return {
		id,
		name,
		order,
		activeColNum,
		layout,
	};
}
