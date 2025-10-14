import { DisplayVariant, SymbolDisplayVariant } from './display';
import { DateRangeStock, DateRangeForex, Stock } from './filters';
import { ForexMarketType } from './market';

export interface ISettingsBase {
	displayVariant: DisplayVariant;
	isCompactMode: boolean;
	pinned: string[];
}

export interface ISettingsForex extends ISettingsBase {
	periodForex: DateRangeForex;
	symbolDisplayVariant: SymbolDisplayVariant;
}

export interface ISettingsStock extends ISettingsBase {
	stock: Stock;
	periodStock: DateRangeStock;
}

export type SettingsByMarket = {
	[ForexMarketType.Stock]: ISettingsStock;
	[ForexMarketType.Forex]: ISettingsForex;
};

export interface IState {
	activeMarket: ForexMarketType;
	settings: SettingsByMarket;
}

const defaultStockSettings: ISettingsStock = {
	stock: Stock.Industry,
	periodStock: DateRangeStock.Week,
	displayVariant: DisplayVariant.Bar,
	isCompactMode: false,
	pinned: [],
};

const defaultForexSettings: ISettingsForex = {
	periodForex: DateRangeForex.Week,
	symbolDisplayVariant: SymbolDisplayVariant.Ticker,
	displayVariant: DisplayVariant.Bar,
	isCompactMode: false,
	pinned: [],
};

export function getDefaultState(type: string): IState {
	const isForex = type === 'forex';
	return {
		activeMarket: isForex ? ForexMarketType.Forex : ForexMarketType.Stock,
		settings: {
			[ForexMarketType.Stock]: defaultStockSettings,
			[ForexMarketType.Forex]: defaultForexSettings,
		},
	};
}
