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

const enableWidgets = new Set(
	getAllEnableWidgets()
		.map(feature => FEATURE_TO_WIDGET_TYPE[feature]),
);
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

		const allWidgets = [
			...this._layout.get(value) || [],
			...Array
				.from(this._layout.values())
				.flat(),
		];

		const seen = new Set<string>();
		const uniqueWidgets = allWidgets.filter(widget => {
			if (seen.has(widget.id)) {
				return false;
			}
			seen.add(widget.id);
			return true;
		});

		this._layout.set(value, uniqueWidgets);
	}

	set name(value: string) {
		this._name = value;
	}

	changeWidgetsState(widgetsState: IWidgetState[]) {
		widgetsState.forEach(({ id, position }) => {
			this.findWidgetById(id).position = position;
		});
	}

	deleteWidget(id: string, widgetsState: IWidgetState[]) {
		this.findWidgetById(id);

		this._layout.forEach((widgets, key) => {
			const updatedWidgets = widgets.filter(widget => widget.id !== id);
			this._layout.set(key, updatedWidgets);
		});

		this.changeWidgetsState(widgetsState);
	}

	private findWidgetById(id: string): Widget {
		const foundedWidget = this.widgets.find(w => w.id === id);

		if (foundedWidget) {
			return foundedWidget;
		}

		throw new NotFoundWidget('Widget with id ' + id + ' not found');
	}

	addWidget(type: string, position: IPosition, widgetsState: IWidgetState[]): Widget {
		const widget = Widget.create(type, position);

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
		const layoutPreset = NAME_TO_PRESET[presetName];
		const layout = new Map<number, Widget[]>();

		Object.entries(layoutPreset).forEach(([type, layouts]) => {
			if (!enableWidgets.has(type as WidgetType)) {
				// eslint-disable-next-line no-console
				console.warn(`Widget type ${type} is not enabled`);
				return;
			}

			let widget: Widget | null = null;

			Object.entries(layouts).forEach(([colNum, pos]) => {
				if (!widget) {
					widget = Widget.create(type, {
						x: pos.x,
						y: pos.y,
						w: pos.size.w,
						h: pos.size.h,
					});
				} else {
					widget.position = {
						x: pos.x,
						y: pos.y,
						w: pos.size.w,
						h: pos.size.h,
					};
				}

				layout.set(Number(colNum), [...layout.get(Number(colNum)) || [], widget]);
			});

			widget = null;
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
