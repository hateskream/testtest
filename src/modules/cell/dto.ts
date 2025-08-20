import type { CellType, ColumnType, Magnitude, Status, SymbolType, Trend } from './domain';

export type Nullable<T> = { [P in keyof T]: T[P] | null | undefined };

export type BaseDto = {
	cellType: CellType;
	columnType: ColumnType;
};

export type IIndexSymbolDto = BaseDto & Nullable<{
	cellType: CellType.Symbol;
	symbolType: SymbolType.Index;
	srcImg: string;
	ticker: string;
	indexName: string;
}>;

export type ICommoditySymbolDto = BaseDto & Nullable<{
	cellType: CellType.Symbol;
	symbolType: SymbolType.Commodity;
	srcImg: string;
	ticker: string;
	commodityName: string;
}>;

export type IStockSymbolDto = BaseDto & Nullable<{
	cellType: CellType.Symbol;
	symbolType: SymbolType.Stock;
	srcImg: string;
	ticker: string;
	companyName: string;
}>;

export type ICryptoSymbolDto = BaseDto & Nullable<{
	cellType: CellType.Symbol;
	symbolType: SymbolType.Crypto;
	srcImg: string;
	ticker: string;
	blockchain: string;
}>;

export type IForexSymbolDto = BaseDto & Nullable<{
	cellType: CellType.Symbol;
	symbolType: SymbolType.Forex;
	rightSrcImg: string;
	leftSrcImg: string;
	rightTicker: string;
	leftTicker: string;
}>;

export type SymbolDto =
	| IIndexSymbolDto
	| ICommoditySymbolDto
	| IStockSymbolDto
	| ICryptoSymbolDto
	| IForexSymbolDto;

export type NumberDto = BaseDto &
	Nullable<{
		value: string;
		trend: Trend;
		currencySymbol: string;
		magnitude: Magnitude;
	}>;

export type PercentDto = BaseDto &
	Nullable<{
		value: string;
		trend: Trend;
		maxAbsValue?: number;
	}>;

export type SvgChartDto = BaseDto &
	Nullable<{
		src: string;
	}>;

export type TextDto = BaseDto &
	Nullable<{
		value: string;
	}>;

export type RangeDto = BaseDto &
	Nullable<{
		currencySymbol: string;
		startValue: string;
		endValue: string;
		startMagnitude: Magnitude;
		endMagnitude: Magnitude;
	}>;

export type LabelDto = BaseDto &
	Nullable<{
		value: string;
		status: Status;
	}>;


export type CellDto = SymbolDto | NumberDto | PercentDto | SvgChartDto | TextDto | RangeDto | LabelDto;
