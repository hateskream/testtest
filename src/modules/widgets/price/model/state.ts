import {
	FilterType,
	type FilterValue,
	MarketTrendFilterValue,
	RankingAndNewFilterValue,
	SectorFilterValue,
	TimeRangeFilterValue,
} from './filters';
import { PriceMarketType } from '@/modules/widgets/price/model/market.ts';

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

type SettingsByMarketType = Record<PriceMarketType, ISettings>;

export interface IState {
	activeMarket: PriceMarketType;
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
	[PriceMarketType.Crypto]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.RankingAndNew]: RankingAndNewFilterValue.Top,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[PriceMarketType.Stock]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.MarketTrend]: MarketTrendFilterValue.Top,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[PriceMarketType.Forex]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[PriceMarketType.Commodity]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.Sector]: SectorFilterValue.All,
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
	[PriceMarketType.Index]: {
		display: getDefaultsSettings(),
		pinned: [],
		filtersState: {
			[FilterType.TimeRange]: TimeRangeFilterValue.Day,
		},
	},
};


export function getDefaultsState(defaultStateType: string): IState {
	let activeMarket: PriceMarketType = PriceMarketType.Crypto;

	if (defaultStateType === 'stock') {
		activeMarket = PriceMarketType.Stock;
	}

	if (defaultStateType === 'forex') {
		activeMarket = PriceMarketType.Forex;
	}

	if (defaultStateType === 'commodity') {
		activeMarket = PriceMarketType.Commodity;
	}

	if (defaultStateType === 'index') {
		activeMarket = PriceMarketType.Index;
	}

	return {
		activeMarket,
		settings: { ...defaultSettingsByMarket },
	};
}
