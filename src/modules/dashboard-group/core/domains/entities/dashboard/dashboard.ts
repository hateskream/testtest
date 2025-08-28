import { v4 as uuidv4 } from 'uuid';


import {
	Widget,
	type IWidgetState,
	type IPosition,
	WidgetType,
	FEATURE_TO_WIDGET_TYPE,
} from '../widget';
import { NotFoundWidget } from './error';
import { NAME_TO_PRESET, type PresetName } from './presets';
import { getAllEnableWidgets } from '@/shared/lib/feature-toggle';

type Layout = Map<number, Widget[]>;

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
export class Dashboard {
	private constructor(
		private readonly _id: string,
		private _name: string,
		private _order: number,
		private _activeColNum: number,
		private _layout: Layout,
	) {}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get order(): number {
		return this._order;
	}

	get activeColNum(): number {
		return this._activeColNum;
	}

	get layout(): Layout {
		return this._layout;
	}

	set order(value: number) {
		this._order = value;
	}

	get widgets(): Widget[] {
		return this._layout.get(this._activeColNum) || [];
	}

	private set widgets(widgets: Widget[]) {
		this._layout.set(this._activeColNum, widgets);
	}

	set activeColNum(value: number) {
		if (this._activeColNum === value) {
			return;
		}

		this._activeColNum = value;

		const activeColWidgets = this._layout.get(value) || [];

		const seen = new Set<string>();
		const uniqueWidgets = activeColWidgets.filter(widget => {
			const key = widget.instanceId || widget.id;
			if (seen.has(key)) {
				return false;
			}
			seen.add(key);
			return true;
		});

		this._layout.set(value, uniqueWidgets);
	}

	set name(value: string) {
		this._name = value;
	}

	getAllWidgetIds(type: WidgetType): string[] {
		return this.widgets
			.filter(widget => widget.widgetType === type)
			.map(widget => widget.id);
	}

	changeWidgetsState(widgetsState: IWidgetState[]) {
		widgetsState.forEach(({ id, position }) => {
			this.findWidgetById(id).position = position;
		});
	}

	deleteWidget(id: string, widgetsState: IWidgetState[]): Widget {
		const widget = this.findWidgetById(id);

		this._layout.forEach((widgets, key) => {
			const updatedWidgets = widgets.filter(w => w.id !== id);
			this._layout.set(key, updatedWidgets);
		});

		this.changeWidgetsState(widgetsState);

		return widget;
	}

	private findWidgetById(id: string): Widget {
		const foundedWidget = this.widgets.find(w => w.id === id);

		if (foundedWidget) {
			return foundedWidget;
		}

		throw new NotFoundWidget('Widget with id ' + id + ' not found');
	}

	addWidget(
		type: string,
		position: IPosition,
		widgetsState: IWidgetState[],
		instanceId?: string,
		config?: Record<string, unknown>,
	): Widget {
		const widget = instanceId
			? Widget.createWithInstanceId(instanceId, type, position, config)
			: Widget.create(type, position);

		this._layout.forEach(widgets => {
			widgets.push(widget);
		});

		this.changeWidgetsState(widgetsState);

		return widget;
	}

	private static create(
		name: string,
		order: number,
		activeColNum: number,
		layout: Layout,
	): Dashboard {
		return new Dashboard(uuidv4(), name, order, activeColNum, layout);
	}

	static createEmpty(order: number, activeColNum: number): Dashboard {
		const layout = new Map();
		layout.set(activeColNum, []);

		return this.create('Dashboard', order, activeColNum, layout);
	}

	static createFromPreset(presetName: PresetName, order: number): Dashboard {
		const preset = NAME_TO_PRESET()[presetName];
		const layout = new Map<number, Widget[]>();

		Object.entries(preset).forEach(([colNum, instances]) => {
			const widgets = instances
				.filter(instance => getEnabledWidgets().has(instance.type))
				.map(instance => {
					return Widget.createWithInstanceId(
						instance.id,
						instance.type,
						{
							x: instance.position.x,
							y: instance.position.y,
							w: instance.position.size.w,
							h: instance.position.size.h,
						},
						instance.config,
					);
				});

			if (widgets.length > 0) {
				layout.set(Number(colNum), widgets);
			}
		});

		/*
			я полагаю экземпляр после создания
			не будет использоваться сразу
			поэтому ставлю несуществующую активную колонку
		*/
		return this.create(presetName, order, 0, layout);
	}

	static rehydrate(
		id: string,
		name: string,
		order: number,
		activeColNum: number,
		layout: Layout,
	): Dashboard {
		return new Dashboard(id, name, order, activeColNum, layout);
	}
}
