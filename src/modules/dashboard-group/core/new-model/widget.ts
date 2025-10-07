import { v4 as uuidv4 } from 'uuid';

import { EnvironmentName, getAllEnableWidgets, getEnvironmentName, type WidgetFeature } from '@/shared/lib';

export enum WidgetType {
	FearGreed = 'fear-greed',
	BitcoinDominance = 'bitcoin-dominance',
	Market = 'market',
	MarketCap = 'market-cap',
	News = 'news',
	Price = 'price',
	HotMarkets = 'hot-markets',
	Watchlist = 'watchlist',
	Performance = 'performance',
	AltcoinSeason = 'altcoin-season',
	TopIndices = 'top-indices',
	Calendar = 'calendar',
	Heatmap = 'heatmap',
}

export interface IPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface ISize {
	w: number;
	h: number;
}

export interface IWidgetState {
	id: string;
	position: IPosition;
}

interface IWidgetPreset {
	widgetType: WidgetType;
	name: string;
	description: string;
	maxSize: ISize;
	minSize: ISize;
	defaultSize: ISize;
}

function isWidgetType(str: string): str is WidgetType {
	return Object.values<string>(WidgetType).includes(str);
}

class InvalidWidgetType extends Error {
	constructor(type: string) {
		super(`Invalid widget type: ${type}`);
	}
}

function createWidgetTypeFromString(str: string): WidgetType {
	if (!isWidgetType(str)) {
		throw new InvalidWidgetType(str);
	}

	return str;
}

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

const Calendar: Preset = {
	name: 'Calendar',
	description: 'Calendar',
	minSize: { w: 2, h: 4 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 6 },
};

const Heatmap: Preset = {
	name: 'Heatmap',
	description: 'Heatmap',
	minSize: { w: 2, h: 7 },
	maxSize: { w: Infinity, h: Infinity },
	defaultSize: { w: 2, h: 7 },
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
	[WidgetType.Calendar]: Calendar,
	[WidgetType.Heatmap]: Heatmap,
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
	[WidgetType.Calendar]: Calendar,
	[WidgetType.Heatmap]: Heatmap,
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
	[WidgetType.Calendar]: Calendar,
	[WidgetType.Heatmap]: Heatmap,
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
	'WIDGET_CALENDAR': WidgetType.Calendar,
	'WIDGET_HEATMAP': WidgetType.Heatmap,
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

function getPresetByType(widgetType: WidgetType): IPresetOptions {
	const preset = getPresets()[widgetType];
	if (!preset) {
		throw new Error(`Preset not found for widget type: ${widgetType}`);
	}

	return {
		...preset,
		widgetType,
	};
}

function createPreset(typeStr: string): IWidgetPreset {
	const type = createWidgetTypeFromString(typeStr);

	return getPresetByType(type);
}

function allWidgets(): IWidgetPreset[] {
	const presets = getPresets();

	return Object.keys(presets).map(createPreset);
}

export interface IWidget extends IWidgetPreset {
	position: IPosition;
	defaultStateType: string;
	id: string;
}

export function createWidget(type: string, position: IPosition, defaultStateType = ''): IWidget {
	const preset = createPreset(type);

	return {
		...preset,
		id: uuidv4(),
		position,
		defaultStateType,
	};
}

function rehydrateWidget(id: string, type: string, position: IPosition): IWidget {
	const preset = createPreset(type);

	return {
		...preset,
		id,
		position,
		defaultStateType: '',
	};
}
