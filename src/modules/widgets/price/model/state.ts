import {
	CryptoTrendFilterValue,
	FilterType,
	type FilterValue,
	SectorFilterValue,
	StockTrendFilterValue,
	TimeRangeFilterValue,
} from './filters';
import { MarketType } from '@/modules/market';
import type { WidgetState } from '@/modules/dashboard-group';

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

export interface IState extends WidgetState {
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

const defaultSettingsCrypto: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.CryptoTrend]: CryptoTrendFilterValue.Gainers,
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsStock: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.StockTrend]: StockTrendFilterValue.Top,
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsForex: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsCommodities: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.Sector]: SectorFilterValue.All,
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsIndices: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsEtf: ISettings = {
	display: getDefaultsSettings(),
	pinned: [],
	filtersState: {
		[FilterType.TimeRange]: TimeRangeFilterValue.Day,
	},
};

const defaultSettingsByMarket: SettingsByMarketType = {
	[MarketType.Crypto]: defaultSettingsCrypto,
	[MarketType.Stock]: defaultSettingsStock,
	[MarketType.Forex]: defaultSettingsForex,
	[MarketType.Commodities]: defaultSettingsCommodities,
	[MarketType.Indices]: defaultSettingsIndices,
	[MarketType.Etf]: defaultSettingsEtf,
};

export function getDefaultsState(defaultStateType: string): IState {
	const ddd = defaultStateType.split('-');

	const [market, filter] = ddd;

	let activeMarket: MarketType = MarketType.Crypto;

	if (market === 'stock') {
		activeMarket = MarketType.Stock;

		if (filter === 'gainers' || filter === 'losers') {
			return {
				activeMarket,
				settings: {
					[MarketType.Crypto]: defaultSettingsCrypto,
					[MarketType.Stock]: {
						...defaultSettingsStock,
						filtersState: {
							[FilterType.StockTrend]: filter === 'gainers'
								? StockTrendFilterValue.Gainers
								: StockTrendFilterValue.Losers,
							[FilterType.TimeRange]: TimeRangeFilterValue.Day,
						},
					},
					[MarketType.Forex]: defaultSettingsForex,
					[MarketType.Commodities]: defaultSettingsCommodities,
					[MarketType.Indices]: defaultSettingsIndices,
					[MarketType.Etf]: defaultSettingsEtf,
				},
			};
		}
	}

	if (market === 'forex') {
		activeMarket = MarketType.Forex;
	}

	if (market === 'commodity') {
		activeMarket = MarketType.Commodities;
	}

	if (market === 'index') {
		activeMarket = MarketType.Indices;
	}

	if (filter === 'gainers') {
		return {
			activeMarket,
			settings: {
				[MarketType.Crypto]: {
					...defaultSettingsCrypto,
					filtersState: {
						[FilterType.CryptoTrend]: CryptoTrendFilterValue.Gainers,
					},
				},
				[MarketType.Stock]: defaultSettingsStock,
				[MarketType.Forex]: defaultSettingsForex,
				[MarketType.Commodities]: defaultSettingsCommodities,
				[MarketType.Indices]: defaultSettingsIndices,
				[MarketType.Etf]: defaultSettingsEtf,
			},
		};
	}

	return {
		activeMarket,
		settings: { ...defaultSettingsByMarket },
	};
}
