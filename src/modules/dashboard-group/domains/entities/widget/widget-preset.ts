import type { IPosition } from './position';
import type { ISize } from './size';
import { createWidgetTypeFromString, InvalidWidgetType, WidgetType } from './widget-type';

export class PresetWidget {
	private static readonly DEFAULT_MIN_SIZE = { w: 1, h: 2 };
	private static readonly DEFAULT_POSITION = { x: -1, y: -1, w: -1, h: -1 };

	private constructor(
		private _widgetType: WidgetType,
		private _name: string,
		private _description: string,
		private _position: IPosition,
		private _maxSize: ISize,
		private _minSize: ISize,
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

	get position(): IPosition {
		return this._position;
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

	static createFearGreed(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.FearGreed,
			'Fear & Greed',
			'Market sentiment index',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createMarket(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.Market,
			'Market',
			'Candlestick formations and price action analysis.',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createPrice(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.Price,
			'Price',
			'Real-time crypto price and chart',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createNews(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.HotMarkets,
			'News',
			'Stay in the know',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createWatchlist(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.Watchlist,
			'Watchlist',
			'Watchlist',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static createHotMarkets(pos = this.DEFAULT_POSITION): PresetWidget {
		return new PresetWidget(
			WidgetType.HotMarkets,
			'Hot Markets',
			'Favorite symbols',
			pos,
			{ w: 2, h: 6 }, // TODO сделать по дизайну
			this.DEFAULT_MIN_SIZE,
			{ w: 2, h: 4 }, // TODO сделать по дизайну
		);
	}

	static create(typeStr: string, pos: IPosition): PresetWidget {
		const type = createWidgetTypeFromString(typeStr);

		const creatorMapping: { [key in WidgetType]: (p: IPosition) => PresetWidget } = {
			[WidgetType.FearGreed]: PresetWidget.createFearGreed,
			[WidgetType.Market]: PresetWidget.createMarket,
			[WidgetType.Price]: PresetWidget.createPrice,
			[WidgetType.HotMarkets]: PresetWidget.createHotMarkets,
			[WidgetType.Watchlist]: PresetWidget.createWatchlist,
			[WidgetType.News]: PresetWidget.createNews,
		};

		if (type in creatorMapping) {
			return creatorMapping[type](pos);
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
