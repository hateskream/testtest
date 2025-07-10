import { v4 as uuidv4 } from 'uuid';


import { Widget, type IWidgetState, type ISize, type IPosition } from '../widget';
import { NotFoundWidget } from './error';
import { WidgetType } from '@/modules/dashboard-group/model';

interface IPresetPosition {
	x: number;
	y: number;
	size: ISize;
}

type IPreset = Partial<Record<WidgetType, IPresetPosition>>;

type PresetName = 'Main';

const MAIN_DASHBOARD_PRESET: IPreset = {
	[WidgetType.Price]: { x: 0, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 3, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 3, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 2, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 4 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 4 } },
};

const NAME_TO_PRESET: Record<PresetName, IPreset> = {
	Main: MAIN_DASHBOARD_PRESET,
};

export class Dashboard {
	private constructor(
		private _id: string,
		private _name: string,
		private _order: number,
		private _widgets: Widget[],
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

	get widgets(): Widget[] {
		return this._widgets;
	}

	set order(value: number) {
		this._order = value;
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

		this._widgets = this._widgets.filter(w => w.id !== id);

		this.changeWidgetsState(widgetsState);
	}

	private findWidgetById(id: string): Widget {
		const foundedWidget = this._widgets.find(w => w.id === id);

		if (foundedWidget) {
			return foundedWidget;
		}

		throw new NotFoundWidget('Widget with id ' + id + ' not found');
	}

	addWidget(type: string, position: IPosition, widgetsState: IWidgetState[]): Widget {
		const widget = Widget.create(type, position);

		this._widgets.push(widget);
		this.changeWidgetsState(widgetsState);

		return widget;
	}

	private static create(name: string, order: number, widgets: Widget[]): Dashboard {
		return new Dashboard(uuidv4(), name, order, widgets);
	}

	static createEmpty(order: number): Dashboard {
		return this.create('Dashboard', order, []);
	}

	static createFromPreset(presetName: PresetName, order: number): Dashboard {
		const preset = NAME_TO_PRESET[presetName];

		const widgets = Object
			.entries(preset)
			.map(([type, presetPosition]) => Widget
				.create(type, {
					x: presetPosition.x,
					y: presetPosition.y,
					w: presetPosition.size.w,
					h: presetPosition.size.h,
				},
				),
			);

		return this.create(presetName, order, widgets);
	}

	static rehydrate(
		id: string,
		name: string,
		order: number,
		widgets: Widget[],
	): Dashboard {
		return new Dashboard(id, name, order, widgets);
	}
}
