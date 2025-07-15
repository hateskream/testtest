import type { ISize } from './size';
import { createWidgetTypeFromString, WidgetType } from './widget-type';

interface IPresetOptions {
	widgetType: WidgetType;
	name: string;
	description: string;
	minSize: ISize;
	maxSize: ISize;
	defaultSize: ISize;
}

const PRESETS: Record<WidgetType, Omit<IPresetOptions, 'widgetType'>> = {
	[WidgetType.FearGreed]: {
		name: 'Fear & Greed',
		description: 'Market sentiment index',
		minSize: { w: 1, h: 2 },
		maxSize: { w: 2, h: 6 },
		defaultSize: { w: 1, h: 3 },
	},
	[WidgetType.Market]: {
		name: 'Market',
		description: 'Candlestick formations and price action analysis.',
		minSize: { w: 2, h: 4 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 4, h: 6 },
	},
	[WidgetType.Price]: {
		name: 'Price',
		description: 'Real-time crypto price and chart',
		minSize: { w: 1, h: 3 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 2, h: 4 },
	},
	[WidgetType.News]: {
		name: 'News',
		description: 'Stay in the know',
		minSize: { w: 2, h: 4 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 2, h: 8 },
	},
	[WidgetType.Watchlist]: {
		name: 'Watchlist',
		description: 'Watchlist',
		minSize: { w: 2, h: 4 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 2, h: 6 },
	},
	[WidgetType.HotMarkets]: {
		name: 'Hot Markets',
		description: 'Favorite symbols',
		minSize: { w: 2, h: 4 }, // TODO сделать по дизайну
		maxSize: { w: Infinity, h: Infinity }, // TODO сделать по дизайну
		defaultSize: { w: 2, h: 6 }, // TODO сделать по дизайну
	},
	[WidgetType.Performance]: {
		name: 'Performance',
		description: 'Performance',
		minSize: { w: 2, h: 4 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 4, h: 9 },
	},
	[WidgetType.Price2]: {
		name: 'Price',
		description: 'Price',
		minSize: { w: 1, h: 3 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 3, h: 8 }, // так вставить в пресет дашборда
	},
	[WidgetType.AltcoinSeason]: {
		name: 'Altcoin Season',
		description: 'Altcoin season',

		/*
			real sizes

			minSize: { w: 2, h: 3 },
			maxSize: { w: Infinity, h: Infinity },
			defaultSize: { w: 2, h: 14 },
		*/

		minSize: { w: 2, h: 3 },
		maxSize: { w: Infinity, h: Infinity },
		defaultSize: { w: 2, h: 3 },
	},
};

// размеры будущих виджетов

/*
		Exchanges
		min 2 4
		max Infinity
		d 4 6
	*/

/*
		MarketCap
		min 1 3
		max Infinity
		d 2 7
	*/

/*
		Bitcoin dominance
		min 1 3
		max Infinity
		d 3 9
	*/
export class PresetWidget {
	private readonly _widgetType: WidgetType;
	private readonly _name: string;
	private readonly _description: string;
	private readonly _maxSize: ISize;
	private readonly _minSize: ISize;
	private readonly _defaultSize: ISize;

	private constructor({
		widgetType,
		name,
		description,
		maxSize,
		minSize,
		defaultSize,
	}: IPresetOptions) {
		this._widgetType = widgetType;
		this._name = name;
		this._description = description;
		this._maxSize = maxSize;
		this._minSize = minSize;
		this._defaultSize = defaultSize;
	}

	get widgetType(): WidgetType {
		return this._widgetType;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get maxSize(): ISize {
		return this._maxSize;
	}

	get minSize(): ISize {
		return this._minSize;
	}

	get defaultSize(): ISize {
		return this._defaultSize;
	}

	private static getOptions(widgetType: WidgetType): IPresetOptions {
		return {
			...PRESETS[widgetType],
			widgetType,
		};
	}

	static create(typeStr: string): PresetWidget {
		const type = createWidgetTypeFromString(typeStr);

		return new PresetWidget(PresetWidget.getOptions(type));
	}

	static allWidgets(): PresetWidget[] {
		return Object.values(WidgetType).map(PresetWidget.create);
	}
}
