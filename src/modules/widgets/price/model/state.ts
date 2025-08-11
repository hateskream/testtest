export enum MarketType {
	Crypto = 'crypto',
	Stock = 'stock',
	Forex = 'forex',
	Commodities = 'commodities',
	Indices = 'indices',
}

const marketToLabel: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Crypto',
	[MarketType.Stock]: 'Stock',
	[MarketType.Forex]: 'Forex',
	[MarketType.Commodities]: 'Commodities',
	[MarketType.Indices]: 'Indices',
};

export function getMarketLabel(market: MarketType): string {
	return marketToLabel[market];
}

interface IMarket {
	type: MarketType;
	label: string;
}

export function getAllMarkets(): IMarket[] {
	return Object.values(MarketType).map(market => ({
		type: market,
		label: getMarketLabel(market),
	}));
}

export interface ISettings {
	isShowChart: boolean;
	isShowPercentageChange: boolean;
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}

type SettingsByMarketType = Record<MarketType, ISettings>;

export interface IState {
	activeMarket: MarketType;
	settings: SettingsByMarketType;
}

const defaultSettings: ISettings = {
	isShowChart: true,
	isShowPercentageChange: true,
	isShowLogo: true,
	isShowTicker: true,
	isShowDescription: false,
};

export function getDefaultsSettings(): ISettings {
	return { ...defaultSettings };
}

export function getDefaultsState(): IState {
	return {
		activeMarket: MarketType.Crypto,
		settings: {
			[MarketType.Crypto]: getDefaultsSettings(),
			[MarketType.Stock]: getDefaultsSettings(),
			[MarketType.Forex]: getDefaultsSettings(),
			[MarketType.Commodities]: getDefaultsSettings(),
			[MarketType.Indices]: getDefaultsSettings(),
		},
	};
}
