export interface IDisplaySettings {
	market: IMarket;
	sizeBy?: ISettings[];
	groupBy?: ISettings[];
	colorBy: IColorBy[];
	displayValue: ISettings[];
}

export interface IMarket {
	displayName: string;
	id: string;
}

export interface ISettings {
	key: string;
	displayName: string;
	isPercent: boolean;
}

export interface IColorBy {
	colorBy: ISettings;
	colorDepth: IColorDepth[];
}

export interface IColorDepth {
	id: string;
	start: number;
	end: number;
}

export const TitleViewVariant = {
	TICKER : 'Ticker',
	NAME : 'Name',
	NONE : 'None',
} as const;

export type TitleViewVariant = typeof TitleViewVariant[keyof typeof TitleViewVariant];

export enum TitleKey {
	TICKER = 'ticker',
	NAME = 'name',
}

export interface IMarketSettings {
	active: string;
	markets: IMarket[];
}

export interface ISingleSetting {
	active: string;
	values: ISettings[];
}

export interface IColorDepthSetting {
	active: string;
	values: IColorDepth[];
}

const crypto: IDisplaySettings = {
	market: {
		id: 'crypto',
		displayName: 'Crypto',
	},
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
	],
	colorBy: [
		{
			colorBy:
				{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24hPercent' },
				{ start: -3, end: 3, id: '3-change24hPercent' },
				{ start: -6, end: 6, id: '6-change24hPercent' },
				{ start: -15, end: 15, id: '15-change24hPercent' },
				{ start: -30, end: 30, id: '30-change24hPercent' },
			],
		},
		{
			colorBy:
				{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24h' },
				{ start: -3, end: 3, id: '3-change24h' },
				{ start: -6, end: 6, id: '6-change24h' },
				{ start: -15, end: 15, id: '15-change24h' },
				{ start: -30, end: 30, id: '30-change24h' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
		{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
		{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
		{ key: 'price', displayName: 'Price', isPercent: false },
	],
};

const stock: IDisplaySettings = {
	market: {
		id: 'stock',
		displayName: 'Stock',
	},
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
	],
	colorBy: [
		{
			colorBy:
				{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24hPercent' },
				{ start: -3, end: 3, id: '3-change24hPercent' },
				{ start: -6, end: 6, id: '6-change24hPercent' },
				{ start: -15, end: 15, id: '15-change24hPercent' },
				{ start: -30, end: 30, id: '30-change24hPercent' },
			],
		},
		{
			colorBy:
				{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24h' },
				{ start: -3, end: 3, id: '3-change24h' },
				{ start: -6, end: 6, id: '6-change24h' },
				{ start: -15, end: 15, id: '15-change24h' },
				{ start: -30, end: 30, id: '30-change24h' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
		{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
		{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
		{ key: 'price', displayName: 'Price', isPercent: false },
	],
	groupBy: [
		// FIXME: WATAHELL why when i change key to industry, it doesnt work
		{ key: 'industries', displayName: 'Industry', isPercent: false },
		{ key: 'sector', displayName: 'Sector', isPercent: false },
		{ key: 'country', displayName: 'Country', isPercent: false },
		{
			key: 'none',
			displayName: 'No group',
			isPercent: false,
		},
	],
};

const forex: IDisplaySettings = {
	market: {
		id: 'forex',
		displayName: 'Forex',
	},
	colorBy: [
		{
			colorBy:
				{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24hPercent' },
				{ start: -3, end: 3, id: '3-change24hPercent' },
				{ start: -6, end: 6, id: '6-change24hPercent' },
				{ start: -15, end: 15, id: '15-change24hPercent' },
				{ start: -30, end: 30, id: '30-change24hPercent' },
			],
		},
		{
			colorBy:
				{ key: 'change', displayName: 'Change', isPercent: false },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24h' },
				{ start: -3, end: 3, id: '3-change24h' },
				{ start: -6, end: 6, id: '6-change24h' },
				{ start: -15, end: 15, id: '15-change24h' },
				{ start: -30, end: 30, id: '30-change24h' },
			],
		},
	],
	displayValue: [
		{ key: 'change1dPercent', displayName: 'Change 1D, %', isPercent: true },
		{ key: 'change1d', displayName: 'Change 1D', isPercent: false },
		{ key: 'price', displayName: 'Price', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
		{ key: 'averageVolume', displayName: 'Average volume', isPercent: false },
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'change', displayName: 'Change 24h', isPercent: false },
		{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
		{ key: 'beta', displayName: 'Beta', isPercent: false },
	],
};

export const displaySettings: Record<string, IDisplaySettings> = {
	crypto,
	stock,
	forex,
};
