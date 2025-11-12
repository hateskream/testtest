import {
	FilterType,
	type FilterValue,
	MarketTrendFilterValue,
	RankingAndNewFilterValue,
	SectorFilterValue,
	TimeRangeFilterValue,
} from './filters';
import { MarketType } from '@/modules/market';

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
			[FilterType.RankingAndNew]: RankingAndNewFilterValue.Top,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[MarketType.Stock]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.MarketTrend]: MarketTrendFilterValue.Top,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[MarketType.Forex]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[MarketType.Commodities]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.Sector]: SectorFilterValue.All,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[MarketType.Indices]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
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

	if (defaultStateType === 'commodity') {
		activeMarket = MarketType.Commodities;
	}

	if (defaultStateType === 'index') {
		activeMarket = MarketType.Indices;
	}

	return {
		activeMarket,
		settings: { ...defaultSettingsByMarket },
	};
}
