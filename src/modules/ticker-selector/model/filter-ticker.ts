import {
	type ColumnType,
	type ISymbolCell,
	type SymbolDto,
	SymbolType,
	type TableRow,
	type TableRowDto,
} from '@/modules/cell';
import { MarketType } from '@/modules/market';
import { IconIds } from '@/shared/ui/icon';

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
}>;

export type TickerRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
}>;


export const FilterListType = {
	All: 'all',
	Selected: 'selected',
} as const;

export type FilterListType = (typeof FilterListType)[keyof typeof FilterListType];

export type ITickerMapped =
	| {
		srcImage?: string | null;
		name?: string | null;
		ticker?: string | null;
		symbolType?: SymbolType | null;
		tickerId: string;
	}
	| {
		srcImage: [string | null | undefined, string | null | undefined];
		name?: string | null;
		ticker?: string | null;
		symbolType?: SymbolType.Forex | null;
		tickerId: string;
	};

export interface IMarketMapped {
	name: string;
	label: string;
	marketType: MarketType;
	icon: IconIds;
}

export interface ITickerSelectAction {
	isSelected: boolean;
	tickerId: string;
}

export interface ITickerEmits {
	(e: 'select', item: string): void;
	(e: 'unselect', item: string): void;
	(e: 'selectAll', item: string[]): void;
	(e: 'unselectAll', item: string[]): void;
}

export const ACTIVE_TICKER_LIST_COUNT_SHOW = 2;

export const SymbolToName: Record<SymbolType, string> = {
	[SymbolType.Index]: 'Index',
	[SymbolType.Commodity]: 'Commodity',
	[SymbolType.Stock]: 'Stock',
	[SymbolType.Crypto]: 'Cryptocurrency',
	[SymbolType.Forex]: 'Forex',
	[SymbolType.PlaneText]: 'Text',
};

export const MarketToSymbol: Record<MarketType, SymbolType> = {
	[MarketType.Crypto]: SymbolType.Crypto,
	[MarketType.Stock]: SymbolType.Stock,
	[MarketType.Forex]: SymbolType.Forex,
	[MarketType.Commodities]: SymbolType.Commodity,
	[MarketType.Indices]: SymbolType.Index,
};

export function getMappedRow(item: TickerDto): ITickerMapped {
	switch (item.symbol.symbolType) {
		case SymbolType.Crypto:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.blockchain,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Stock:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.companyName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Commodity:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.commodityName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Forex:
			return {
				tickerId: item.tickerId,
				srcImage: [item.symbol.leftSrcImg, item.symbol.rightSrcImg],
				name: '',
				ticker:
					item.symbol.leftTicker && item.symbol.rightTicker ?
					`${item.symbol.leftTicker}/${item.symbol.rightTicker}` :
						'N/A',
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Index:
			return {
				srcImage: item.symbol.srcImg,
				tickerId: item.tickerId,
				name: item.symbol.indexName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};


		default:
			return {
				srcImage: null,
				tickerId: item.tickerId,
				name: item.symbol.cellType,
				ticker: item.tickerId,
				symbolType: item.symbol.symbolType,
			};
	}
}

export function getMappedMarket(market: MarketType): IMarketMapped {
	switch (market) {
		case MarketType.Crypto:
			return {
				name: 'Crypto',
				label: 'All cryptocurrencies',
				marketType: MarketType.Crypto,
				icon: IconIds.Cryptos,
			};
		case MarketType.Stock:
			return {
				name: 'Stock',
				label: 'All stocks',
				marketType: MarketType.Stock,
				icon: IconIds.SelectAll,
			};
		case MarketType.Forex:
			return {
				name: 'Forex',
				label: 'All forex pairs',
				marketType: MarketType.Forex,
				icon: IconIds.SelectAll,
			};
		case MarketType.Commodities:
			return {
				name: 'Commodities',
				label: 'All commodities',
				marketType: MarketType.Commodities,
				icon: IconIds.SelectAll,
			};
		case MarketType.Indices:
			return {
				name: 'Indices',
				label: 'All indices',
				marketType: MarketType.Indices,
				icon: IconIds.SelectAll,
			};
	}
}

export function isCryptoTicker(ticker: ITickerMapped) {
	return ticker.symbolType === SymbolType.Crypto;
}

export function isForexTicker(ticker: ITickerMapped) {
	return ticker.symbolType === SymbolType.Forex;
}
