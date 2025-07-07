import { v4 as uuidv4 } from 'uuid';


import { Widget } from '../widget';
import { PresetWidget } from '../widget/widget-preset';

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

	addWidget(widget: Widget) {
		this._widgets.push(widget);
	}

	static createMainDashboard(order = 0): Dashboard {
		const cryptoPreset = [
			PresetWidget.createHotMarkets({ x: 0, y: 0, w: 2, h: 4 }),
			PresetWidget.createFearGreed({ x: 2, y: 0, w: 2, h: 4 }),
			PresetWidget.createPrice({ x: 4, y: 0, w: 2, h: 4 }),
			PresetWidget.createMarket({ x: 0, y: 4, w: 3, h: 4 }),
			PresetWidget.createNews({ x: 3, y: 4, w: 3, h: 4 }),
			PresetWidget.createWatchlist({ x: 6, y: 0, w: 2, h: 4 }),
		];

		return new Dashboard(
			uuidv4(),
			'Main',
			order,
			Widget.createFromPresets(cryptoPreset),
		);
	}
}
