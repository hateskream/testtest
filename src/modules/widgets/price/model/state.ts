import { MarketType } from '@/modules/market';

export interface ISettings {
	isShowChart: boolean;
	isShowPercentageChange: boolean;
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}

type SettingsByMarketType = Record<MarketType, { display: ISettings; pinned: string[] }>;

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

const defaultSettingsByMarket: SettingsByMarketType = {
	[MarketType.Crypto]: {
		display: getDefaultsSettings(),
		pinned: [],
	},
	[MarketType.Stock]: {
		display: getDefaultsSettings(),
		pinned: [],
	},
	[MarketType.Forex]: {
		display: getDefaultsSettings(),
		pinned: [],
	},
	[MarketType.Commodities]: {
		display: getDefaultsSettings(),
		pinned: [],
	},
	[MarketType.Indices]: {
		display: getDefaultsSettings(),
		pinned: [],
	},
};

export function getDefaultsState(defaultStateType: string): IState {
	let activeMarket: MarketType = MarketType.Crypto;

	if (defaultStateType === 'stock') {
		activeMarket = MarketType.Stock;
	}

	if (defaultStateType === 'forex') {
		activeMarket = MarketType.Forex;
	}

	if (defaultStateType === 'commodities') {
		activeMarket = MarketType.Commodities;
	}

	if (defaultStateType === 'indices') {
		activeMarket = MarketType.Indices;
	}

	return {
		activeMarket,
		settings: { ...defaultSettingsByMarket },
	};
}
