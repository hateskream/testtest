import { v4 as uuidv4 } from 'uuid';


import { Widget, type IWidgetState, type IPosition } from '../widget';
import { NotFoundWidget } from './error';
import { NAME_TO_PRESET, type PresetName } from './presets';

type Layout = Map<number, Widget[]>;

export class Dashboard {
	private constructor(
		private readonly _id: string,
		private _name: string,
		private _order: number,
		private _activeColNum: number,
		private _layouts: Layout,
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

	set order(value: number) {
		this._order = value;
	}

	get activeColNum(): number {
		return this._activeColNum;
	}

	get widgets(): Widget[] {
		return this._layouts.get(this._activeColNum) || [];
	}

	private set widgets(widgets: Widget[]) {
		this._layouts.set(this._activeColNum, widgets);
	}

	set activeColNum(value: number) {
		this._activeColNum = value;

		const allWidgets = [
			...this._layouts.get(value) || [],
			...Array
				.from(this._layouts.values())
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

		this._layouts.set(value, uniqueWidgets);
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

		this._layouts.forEach((widgets, key) => {
			const updatedWidgets = widgets.filter(widget => widget.id !== id);
			this._layouts.set(key, updatedWidgets);
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

		this._layouts.forEach(widgets => {
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

		const layout = new Map(
			Object
				.entries(layoutPreset)
				.map(([colNum, preset]) =>
					[Number(colNum), Object
						.entries(preset)
						.map(([type, presetPosition]) =>
							Widget.create(type, {
								x: presetPosition.x,
								y: presetPosition.y,
								w: presetPosition.size.w,
								h: presetPosition.size.h,
							}),
						)],
				),
		);

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
