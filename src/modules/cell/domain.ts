export enum ColumnType {
	Symbol = 'symbol',

	PriceCurrent = 'priceCurrent',
	PriceMin24h = 'priceMin24h',
	PriceMax24h = 'priceMax24h',
	PriceMin1y = 'priceMin1y',
	PriceMax1y = 'priceMax1y',
	PriceAvg50d = 'priceAvg50d',
	PriceAvg200d = 'priceAvg200d',
	Price1yRange = 'price1yRange',

	Price24hChart = 'price24hChart',
	Price7dChart = 'price7dChart',
	Price30dChart = 'price30dChart',

	ChangePrice24h = 'changePrice24h',
	ChangePrice1hPercent = 'changePrice1hPercent',
	ChangePrice24hPercent = 'changePrice24hPercent',
	ChangePrice7dPercent = 'changePrice7dPercent',
	ChangePrice30dPercent = 'changePrice30dPercent',

	Volume24h = 'volume24h',
	VolumeRel10d = 'volumeRel10d',
	VolumeAvg10d = 'volumeAvg10d',

	MarketCap24h = 'marketCap24h',

	RSIValue = 'rsiValue',
	RSIChart = 'rsiChart',

	Beta5y = 'beta5y',

	LastDividend = 'lastDividend',

	Employees = 'employees',
	IpODate = 'ipoDate',
	Sector = 'sector',
	Industry = 'industry',

	Source = 'source',

	ListingDate = 'listingDate',

	UpdateDate = 'updateDate',

	OpenPrice = 'openPrice',
	ClosePrice = 'closePrice',
}

export enum CellType {
	Symbol = 'Symbol',
	Number = 'Number',
	Percent = 'Percent',
	SvgChart = 'SvgChart',
	Text = 'Text',
	Range = 'Range',
	Empty = 'Empty',
}

export enum Trend {
	UP = 'increase',
	DOWN = 'decrease',
	NEUTRAL = 'stable',
}

export enum Magnitude {
	THOUSAND = 'thousand',
	MILLION = 'million',
	BILLION = 'billion',
	TRILLION = 'trillion',
	NONE = 'none',
}

interface IBaseCell {
	cellType: CellType;
	columnType: ColumnType;
}

export interface IEmptyCell extends IBaseCell {
	cellType: CellType.Empty;
}

export enum SymbolType {
	Index = 'Index',
	Commodity = 'Commodity',
	Stock = 'Stock',
	Crypto = 'Crypto',
	Forex = 'Forex',
}

export interface ISymbolCellBase extends IBaseCell {
	cellType: CellType.Symbol;
	columnType: ColumnType.Symbol;
	symbolType: SymbolType;
}

export interface IIndexSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Index;
	srcImg: string;
	ticker: string;
	indexName: string;
}

export interface ICommoditySymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Commodity;
	srcImg: string;
	ticker: string;
	commodityName: string;
}

export interface IStockSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Stock;
	srcImg: string;
	ticker: string;
	companyName: string;
}

export interface ICryptoSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Crypto;
	srcImg: string;
	ticker: string;
	blockchain: string;
}

export interface IForexSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Forex;
	rightSrcImg: string;
	leftSrcImg: string;
	rightTicker: string;
	leftTicker: string;
}

export type ISymbolCell =
  | IIndexSymbolCell
  | ICommoditySymbolCell
  | IStockSymbolCell
  | ICryptoSymbolCell
  | IForexSymbolCell;

export interface INumberCell extends IBaseCell {
	cellType: CellType.Number;
	value: string;
	trend: Trend;
	currencySymbol: string;
	magnitude: Magnitude;
}

export interface IPercentCell extends IBaseCell {
	cellType: CellType.Percent;
	value: string;
	trend: Trend;
}

export interface ISvgChartCell extends IBaseCell {
	cellType: CellType.SvgChart;
	src: string;
}

export interface ITextCell extends IBaseCell {
	cellType: CellType.Text;
	value: string;
}

export interface IRangeCell extends IBaseCell {
	cellType: CellType.Range;
	currencySymbol: string;
	startValue: string;
	endValue: string;
	startMagnitude: Magnitude;
	endMagnitude: Magnitude;
}

export type Cell =
	| IEmptyCell
	| ISymbolCell
	| INumberCell
	| IPercentCell
	| ISvgChartCell
	| ITextCell
	| IRangeCell;

export const columnToCell: Record<ColumnType, CellType> = {
	[ColumnType.Symbol]: CellType.Symbol,

	[ColumnType.PriceCurrent]: CellType.Number,
	[ColumnType.PriceMin24h]: CellType.Number,
	[ColumnType.PriceMax24h]: CellType.Number,
	[ColumnType.PriceMin1y]: CellType.Number,
	[ColumnType.PriceMax1y]: CellType.Number,
	[ColumnType.PriceAvg50d]: CellType.Number,
	[ColumnType.PriceAvg200d]: CellType.Number,
	[ColumnType.Price1yRange]: CellType.Range,

	[ColumnType.Price24hChart]: CellType.SvgChart,
	[ColumnType.Price7dChart]: CellType.SvgChart,
	[ColumnType.Price30dChart]: CellType.SvgChart,

	[ColumnType.ChangePrice24h]: CellType.Number,
	[ColumnType.ChangePrice1hPercent]: CellType.Percent,
	[ColumnType.ChangePrice24hPercent]: CellType.Percent,
	[ColumnType.ChangePrice7dPercent]: CellType.Percent,
	[ColumnType.ChangePrice30dPercent]: CellType.Percent,

	[ColumnType.Volume24h]: CellType.Number,
	[ColumnType.VolumeRel10d]: CellType.Number,
	[ColumnType.VolumeAvg10d]: CellType.Number,

	[ColumnType.MarketCap24h]: CellType.Number,

	[ColumnType.RSIValue]: CellType.Number,
	[ColumnType.RSIChart]: CellType.SvgChart,

	[ColumnType.Beta5y]: CellType.Number,

	[ColumnType.LastDividend]: CellType.Number,

	[ColumnType.Employees]: CellType.Number,
	[ColumnType.IpODate]: CellType.Text,
	[ColumnType.Sector]: CellType.Text,
	[ColumnType.Industry]: CellType.Text,

	[ColumnType.Source]: CellType.Text,

	[ColumnType.ListingDate]: CellType.Text,

	[ColumnType.UpdateDate]: CellType.Text,

	[ColumnType.OpenPrice]: CellType.Number,
	[ColumnType.ClosePrice]: CellType.Number,
};
