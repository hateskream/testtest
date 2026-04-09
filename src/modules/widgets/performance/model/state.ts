import { MarketType } from '@/modules/market';
import type { WidgetState } from '@/modules/dashboard-group';
import { DisplayVariant, SymbolDisplayVariant } from './display';
import { DateRangeForex, DateRangeStock, Stock } from './filters';
import { Currency } from './quote-currency';
import type { PerformanceMarketType } from './market-type.ts';

export interface ISettingsBase {
	displayVariant: DisplayVariant;
	isCompactMode: boolean;
	pinned: string[];
}

export interface ISettingsForex extends ISettingsBase {
	periodForex: DateRangeForex;
	quoteCurrency: Currency;
	symbolDisplayVariant: SymbolDisplayVariant;
}

export interface ISettingsStock extends ISettingsBase {
	stock: Stock;
	periodStock: DateRangeStock;
}

export type SettingsByMarket = {
	[MarketType.Stock]: ISettingsStock;
	[MarketType.Forex]: ISettingsForex;
};

export interface IState extends WidgetState {
	activeMarket: PerformanceMarketType;
	settings: SettingsByMarket;
}

const defaultStockSettings: ISettingsStock = {
	stock: Stock.Sector,
	periodStock: DateRangeStock.Today,
	displayVariant: DisplayVariant.Bar,
	isCompactMode: false,
	pinned: [],
};

const defaultForexSettings: ISettingsForex = {
	periodForex: DateRangeForex.FiveDays,
	symbolDisplayVariant: SymbolDisplayVariant.Ticker,
	displayVariant: DisplayVariant.Bar,
	isCompactMode: false,
	quoteCurrency: Currency.USD,
	pinned: [],
};

export function getDefaultState(type: string): IState {
	const isForex = type === 'forex';
	return {
		activeMarket: isForex ? MarketType.Forex : MarketType.Stock,
		settings: {
			[MarketType.Stock]: defaultStockSettings,
			[MarketType.Forex]: defaultForexSettings,
		},
	};
}
