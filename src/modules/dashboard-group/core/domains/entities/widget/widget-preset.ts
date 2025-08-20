import { EnvironmentName, getAllEnableWidgets, getEnvironmentName, type WidgetFeature } from '@/shared/lib';
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

type Preset = Omit<IPresetOptions, 'widgetType'>;
type AllPresets = Record<WidgetType, Preset>;
type Presets = Partial<Record<WidgetType, Preset>>;

const FearGreed: Preset = {
	name: 'Fear & Greed',
	description: 'Market sentiment index',
	minSize: { w: 1, h: 2 },
	maxSize: { w: 2, h: 6 },
	defaultSize: { w: 1, h: 3 },
};

const Market: Preset = {
	name: 'Market',
	description: 'Candlestick formations and price action analysis.',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 4, h: 6 },
};

const Price: Preset = {
	name: 'Price',
	description: 'Real-time crypto price and chart',
	minSize: { w: 1, h: 3 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 4 },
};

const News: Preset = {
	name: 'News',
	description: 'Stay in the know',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 8 },
};

const Watchlist: Preset = {
	name: 'Watchlist',
	description: 'Watchlist',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 6 },
};

const HotMarkets: Preset = {
	name: 'Hot Markets',
	description: 'Favorite symbols',
	minSize: { w: 2, h: 4 }, // TODO сделать по дизайну
	maxSize: { w: Infinity, h: Infinity }, // TODO сделать по дизайну
	defaultSize: { w: 2, h: 6 }, // TODO сделать по дизайну
};

const Performance: Preset = {
	name: 'Performance',
	description: 'Performance',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 4, h: 9 },
};

const MarketCap: Preset = {
	name: 'MarketCap',
	description: 'MarketCap',
	minSize: { w: 1, h: 3 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 3, h: 7 }, // так вставить в пресет дашборда
};

const AltcoinSeason: Preset = {
	name: 'Altcoin Season',
	description: 'Altcoin season',
	minSize: { w: 2, h: 3 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 14 },
};

const BitcoinDominance: Preset = {
	name: 'Bitcoin Dominance',
	description: 'Bitcoin Dominance',
	minSize: { w: 1, h: 3 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 3, h: 9 },
};

const TopIndices: Preset = {
	name: 'Top Indices YTD',
	description: 'Top Indices',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 6 },
};

const ProdPresets: AllPresets = {
	[WidgetType.FearGreed]: FearGreed,
	[WidgetType.Market]: Market,
	[WidgetType.Price]: Price,
	[WidgetType.News]: News,
	[WidgetType.Watchlist]: Watchlist,
	[WidgetType.HotMarkets]: HotMarkets,
	[WidgetType.Performance]: Performance,
	[WidgetType.MarketCap]: MarketCap,
	[WidgetType.AltcoinSeason]: AltcoinSeason,
	[WidgetType.BitcoinDominance]: BitcoinDominance,
	[WidgetType.TopIndices]: TopIndices,
};

const DevPresets: AllPresets = {
	[WidgetType.FearGreed]: FearGreed,
	[WidgetType.Market]: Market,
	[WidgetType.Price]: Price,
	[WidgetType.News]: News,
	[WidgetType.Watchlist]: Watchlist,
	[WidgetType.HotMarkets]: HotMarkets,
	[WidgetType.Performance]: Performance,
	[WidgetType.MarketCap]: MarketCap,
	[WidgetType.AltcoinSeason]: AltcoinSeason,
	[WidgetType.BitcoinDominance]: BitcoinDominance,
	[WidgetType.TopIndices]: TopIndices,
};

const DemoPresets: AllPresets = {
	[WidgetType.FearGreed]: FearGreed,
	[WidgetType.Market]: Market,
	[WidgetType.Price]: Price,
	[WidgetType.News]: News,
	[WidgetType.Watchlist]: Watchlist,
	[WidgetType.HotMarkets]: HotMarkets,
	[WidgetType.Performance]: Performance,
	[WidgetType.MarketCap]: MarketCap,
	[WidgetType.AltcoinSeason]: AltcoinSeason,
	[WidgetType.BitcoinDominance]: BitcoinDominance,
	[WidgetType.TopIndices]: TopIndices,
};

function getCurrentPresets(): AllPresets {
	const environment = getEnvironmentName();

	switch (environment) {
		case EnvironmentName.DEV:
			return DevPresets;
		case EnvironmentName.DEMO:
			return DemoPresets;
		case EnvironmentName.PROD:
			return ProdPresets;
		default:
			throw new Error(`Unknown environment: ${environment}`);
	}
}

export const FEATURE_TO_WIDGET_TYPE: Record<WidgetFeature, WidgetType> = {
	'WIDGET_ALTCOIN_SEASON': WidgetType.AltcoinSeason,
	'WIDGET_FEAR_GREED': WidgetType.FearGreed,
	'WIDGET_HOT_MARKETS': WidgetType.HotMarkets,
	'WIDGET_MARKET': WidgetType.Market,
	'WIDGET_MARKET_CAP': WidgetType.MarketCap,
	'WIDGET_NEWS': WidgetType.News,
	'WIDGET_PERFORMANCE': WidgetType.Performance,
	'WIDGET_PRICE_LIST': WidgetType.Price,
	'WIDGET_WATCH_LIST': WidgetType.Watchlist,
	'WIDGET_BITCOIN_DOMINANCE': WidgetType.BitcoinDominance,
	'WIDGET_TOP_INDICES': WidgetType.TopIndices,
};

function getPresets(): Presets {
	const currentPresets = getCurrentPresets();
	const enableWidgets = getAllEnableWidgets();

	const result: Partial<AllPresets> = {};

	for (const featureWidget of enableWidgets) {
		const widgetType = FEATURE_TO_WIDGET_TYPE[featureWidget];
		result[widgetType] = currentPresets[widgetType];
	}

	return result;
}

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
		const preset = getPresets()[widgetType];
		if (!preset) {
			throw new Error(`Preset not found for widget type: ${widgetType}`);
		}

		return {
			...preset,
			widgetType,
		};
	}

	static create(typeStr: string): PresetWidget {
		const type = createWidgetTypeFromString(typeStr);

		return new PresetWidget(PresetWidget.getOptions(type));
	}

	static allWidgets(): PresetWidget[] {
		const presets = getPresets();

		return Object.keys(presets).map(PresetWidget.create);
	}
}
