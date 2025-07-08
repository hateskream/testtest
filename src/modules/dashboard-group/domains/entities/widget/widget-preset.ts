import type { ISize } from './size';
import { createWidgetTypeFromString, InvalidWidgetType, WidgetType } from './widget-type';

export class PresetWidget {
	private readonly DEFAULT_MIN_SIZE = { w: 1, h: 2 };

	private constructor(
		private _widgetType: WidgetType,
		private _name: string,
		private _description: string,
		private _maxSize: ISize,
		private _defaultSize: ISize,
	) {}

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
		return this.DEFAULT_MIN_SIZE;
	}

	get defaultSize(): ISize {
		return this._defaultSize;
	}

	static createFearGreed(): PresetWidget {
		return new PresetWidget(
			WidgetType.FearGreed,
			'Fear & Greed',
			'Market sentiment index',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createMarket(): PresetWidget {
		return new PresetWidget(
			WidgetType.Market,
			'Market',
			'Candlestick formations and price action analysis.',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createPrice(): PresetWidget {
		return new PresetWidget(
			WidgetType.Price,
			'Price',
			'Real-time crypto price and chart',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createNews(): PresetWidget {
		return new PresetWidget(
			WidgetType.HotMarkets,
			'News',
			'Stay in the know',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createWatchlist(): PresetWidget {
		return new PresetWidget(
			WidgetType.Watchlist,
			'Watchlist',
			'Watchlist',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createHotMarkets(): PresetWidget {
		return new PresetWidget(
			WidgetType.HotMarkets,
			'Hot Markets',
			'Favorite symbols',
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static create(typeStr: string): PresetWidget {
		const type = createWidgetTypeFromString(typeStr);

		const creatorMapping: { [key in WidgetType]: () => PresetWidget } = {
			[WidgetType.FearGreed]: PresetWidget.createFearGreed,
			[WidgetType.Market]: PresetWidget.createMarket,
			[WidgetType.Price]: PresetWidget.createPrice,
			[WidgetType.HotMarkets]: PresetWidget.createHotMarkets,
			[WidgetType.Watchlist]: PresetWidget.createWatchlist,
			[WidgetType.News]: PresetWidget.createNews,
		};

		if (type in creatorMapping) {
			return creatorMapping[type]();
		}

		throw new InvalidWidgetType(typeStr);
	}
}

export function allWidgets(): PresetWidget[] {
	return [
		PresetWidget.createFearGreed(),
		PresetWidget.createMarket(),
		PresetWidget.createPrice(),
		PresetWidget.createNews(),
		PresetWidget.createWatchlist(),
		PresetWidget.createHotMarkets(),
	];
}
