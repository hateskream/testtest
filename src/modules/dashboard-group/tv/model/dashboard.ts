import { v4 as uuidv4 } from 'uuid';

import { createWidget, type IPosition, type IWidget, type IWidgetState } from './widget';
import { WidgetType } from '@/modules/dashboard-group';
import { NAME_TO_PRESET, type PresetName } from './dashbord-presets';
import { useLogger } from '@/shared/service/monitoring';

type Layout = Record<number, IWidget[]>;

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

function getWidgets(dashboard: IDashboardPrivate): IWidget[] {
	if (!Object.prototype.hasOwnProperty.call(dashboard.layout, dashboard.activeColNum)) {
		const logger = useLogger();
		logger.error(
			'Missing Dashboard layout for activeColNum',
			{ context: {
				dashboard: {
					availableKeys: Object.keys(dashboard.layout),
					activeColNum: dashboard.activeColNum,
					id: dashboard.id,
					name: dashboard.name,
				},
			} },
		);
	}

	return dashboard.layout[dashboard.activeColNum] || [];
}

function setWidgets(dashboard: IDashboardPrivate, widgets: IWidget[]): IDashboardPrivate {
	return {
		...dashboard,
		layout: {
			...dashboard.layout,
			[dashboard.activeColNum]: [...widgets],
		},
	};
}

export function setActiveColumn(dashboard: IDashboardPrivate, activeColNum: number): IDashboardPrivate {
	if (dashboard.activeColNum === activeColNum) {
		return dashboard;
	}

	const activeColWidgets = dashboard.layout[activeColNum] || [];

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
		...setWidgets({
			...dashboard,
			activeColNum,
		}, uniqueWidgets),
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

	const updatedWidgets = widgets.map(widget => {
		const widgetState = widgetsState.find(w => w.id === widget.id);
		if (widgetState) {
			return {
				...widget,
				position: widgetState.position,
			};
		}
		return widget;
	});

	return setWidgets(dashboard, updatedWidgets);
}

export function deleteWidget(
	dashboard: IDashboardPrivate,
	widgetId: string,
	widgetsState: IWidgetState[],
): IDashboardPrivate {
	const newLayout: Layout = {};

	// eslint-disable-next-line no-restricted-syntax
	for (const key in dashboard.layout) {
		const widgets = dashboard.layout[key];
		newLayout[key] = widgets.filter(w => w.id !== widgetId);
	}

	return changeWidgetsState(
		{
			...dashboard,
			layout: newLayout,
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

	const newLayout: Layout = {};
	// eslint-disable-next-line no-restricted-syntax
	for (const key in dashboard.layout) {
		newLayout[key] = [...dashboard.layout[key], widget!];
	}

	return changeWidgetsState(
		{
			...dashboard,
			layout: newLayout,
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
	const layout: Layout = {
		[activeColNum]: [],
	};

	return createDashboard('Dashboard', order, activeColNum, layout);
}

export function createDashboardFromPreset(presetName: PresetName, order: number, colNum: number): IDashboardPrivate {
	const preset = NAME_TO_PRESET()[presetName];
	const layout: Layout = {};

	Object.entries(preset).forEach(([cn, instances]) => {
		const widgets = instances
			.map(instance => {
				return createWidget(
					instance.type,
					{
						x: instance.position.x,
						y: instance.position.y,
						w: instance.position.size.w,
						h: instance.position.size.h,
					},
					instance.defaultStateType || 'none',
				);
			}).filter((x) => x !== null);

		if (widgets.length > 0) {
			layout[Number(cn)] = widgets;
		}
	});

	return createDashboard(presetName, order, colNum, layout);
}
