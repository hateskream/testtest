import { MarketType } from '@/modules/market';
import { FilterType, RankingAndNewFilterValue, TimeRangeFilterValue, type FilterValue } from './filters';

export interface IDisplaySettings {
	isShowChart: boolean;
	isShowPercentageChange: boolean;
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}

interface ISettings {
	display: IDisplaySettings;
	pinned: string[];
	filtersState: {
		[key in FilterType]?: FilterValue;
	};
}

type SettingsByMarketType = Record<MarketType, ISettings>;

export interface IState {
	activeMarket: MarketType;
	settings: SettingsByMarketType;
}

const defaultSettings: IDisplaySettings = {
	isShowChart: true,
	isShowPercentageChange: true,
	isShowLogo: true,
	isShowTicker: true,
	isShowDescription: false,
};

export function getDefaultsSettings(): IDisplaySettings {
	return { ...defaultSettings };
}

const defaultSettingsByMarket: SettingsByMarketType = {
	[MarketType.Crypto]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
			[FilterType.RankingAndNew]: RankingAndNewFilterValue.Top,
		},
	},
	[MarketType.Stock]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {},
	},
	[MarketType.Forex]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {},
	},
	[MarketType.Commodities]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {},
	},
	[MarketType.Indices]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {},
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
