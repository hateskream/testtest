import { MarketType } from '@/modules/market';
import { DisplayVariant, SymbolDisplayVariant } from './display';
import { DateRangeStock, DateRangeForex, Stock } from './filters';
import { Currency } from './quote-currency';

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

export interface IState {
	activeMarket: MarketType.Stock | MarketType.Forex;
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
