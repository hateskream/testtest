import { MarketType } from '../market';

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
	PriceOpen = 'priceOpen',
	PriceClose = 'priceClose',
	// I replaced open and close price with priceOpen and priceClose
	// because I think it's more clear and consistent.
	// OpenPrice = 'openPrice',
	// ClosePrice = 'closePrice',

	Price24hChart = 'price24hChart',
	Price7dChart = 'price7dChart',
	Price30dChart = 'price30dChart',

	ChangePrice24h = 'changePrice24h',
	ChangePriceYTD = 'changePriceYTD',

	ChangePrice1hPercent = 'changePrice1hPercent',
	ChangePrice24hPercent = 'changePrice24hPercent',
	ChangePrice7dPercent = 'changePrice7dPercent',
	ChangePrice30dPercent = 'changePrice30dPercent',
	ChangePriceYTDPercent = 'changePriceYTDPercent',

	Volume24h = 'volume24h',
	VolumeRel10d = 'volumeRel10d',
	VolumeAvg10d = 'volumeAvg10d',
	VolumeAvg50d = 'volumeAvg50d',

	AllTimeHigh = 'allTimeHigh',
	AllTimeHighChangePercent = 'allTimeHighChangePercent',
	AllTimeHighDate = 'allTimeHighDate',

	AllTimeLow = 'allTimeLow',
	AllTimeLowChangePercent = 'allTimeLowChangePercent',
	AllTimeLowDate = 'allTimeLowDate',

	MarketCap24h = 'marketCap24h',
	MarketCapRank = 'marketCapRank',
	MarketCapChange24h = 'marketCapChange24h',
	MarketCapChange24hPercent = 'marketCapChange24hPercent',
	MarketCapFullyDiluted = 'marketCapFullyDiluted',

	CirculatingSupply = 'circulatingSupply',
	TotalSupply = 'totalSupply',
	MaxSupply = 'maxSupply',

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

	Volatility = 'volatility',

	AnalystRating = 'analystRating',
	VolumeRel24h = 'volumeRel24h',
	VolumeRelAvg50d = 'volumeRelAvg50d',
	PriceEarnings = 'priceEarnings',
	EpsDil12mo = 'epsDil12mo',
	EpsDilAvg50d = 'epsDilAvg50d',
	EpsDilGrowth12mo = 'epsDilGrowth12mo',
	EpsDilGrowthAvg50d = 'epsDilGrowthAvg50d',
	DividendYield = 'dividendYield',
	TrustScore = 'trustScore',
	Open = 'open',
	Incentive = 'incentive',
	MarketHours = 'marketHours',
	Volume24hNorm = 'volume24hNorm',
	Coins = 'coins',
	Pairs = 'pairs',

	Launched = 'launched',
	DEXRank = 'DEXRank',
	Country = 'country',
	NextClosedDay = 'nextClosedDay',

	Performance = 'Performance',
}

export enum CellType {
	Symbol = 'Symbol',
	Number = 'Number',
	Percent = 'Percent',
	SvgChart = 'SvgChart',
	Text = 'Text',
	Range = 'Range',
	Empty = 'Empty',
	Label = 'Label',
	Score = 'Score',
	Open = 'Open',
	Check = 'Check',
	Schedule = 'Schedule',
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

export enum Status {
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	NEUTRAL = 'neutral',
	CAUTION = 'caution',
}

export interface IBaseCell {
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
	Etf = 'ETF',
	PlaneText = 'PlainText',
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

export interface IEtfSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.Etf;
	srcImg: string;
	ticker: string;
}

export interface IPlaneTextSymbolCell extends ISymbolCellBase {
	symbolType: SymbolType.PlaneText;
	text: string;
}

export type ISymbolCell =
	| IIndexSymbolCell
	| ICommoditySymbolCell
	| IStockSymbolCell
	| ICryptoSymbolCell
	| IForexSymbolCell
	| IEtfSymbolCell
	| IPlaneTextSymbolCell;

export interface INumberCell extends IBaseCell {
	cellType: CellType.Number;
	value: string;
	trend: Trend;
	currencySymbol: string;
	magnitude: Magnitude;
}

export interface IScoreCell extends IBaseCell {
	cellType: CellType.Score;
	value: string;
	score: number;
}

export interface IPercentCell extends IBaseCell {
	cellType: CellType.Percent;
	value: string;
	trend: Trend;
	maxAbsValue?: number;
}

export interface ISvgChartCell extends IBaseCell {
	cellType: CellType.SvgChart;
	src: string;
}

export interface ITextCell extends IBaseCell {
	cellType: CellType.Text;
	value: string;
}

export interface IOpenCell extends IBaseCell {
	cellType: CellType.Open;
	value: boolean | string;
}

export interface IRangeCell extends IBaseCell {
	cellType: CellType.Range;
	currencySymbol: string;
	startValue: string;
	endValue: string;
	startMagnitude: Magnitude;
	endMagnitude: Magnitude;
}

export interface ILableCell extends IBaseCell {
	cellType: CellType.Label;
	value: string;
	status: Status;
}


export interface ICheckCell extends IBaseCell {
	cellType: CellType.Check;
	value: boolean;
}


export interface IScheduleCell extends IBaseCell {
	cellType: CellType.Schedule;
	start: string;
	finish: string;
	current: string;
}

export type Cell =
	| IEmptyCell
	| ISymbolCell
	| INumberCell
	| IPercentCell
	| ISvgChartCell
	| ITextCell
	| ILableCell
	| IRangeCell
	| IScoreCell
	| IOpenCell
	| ICheckCell
	| IScheduleCell;

export const columnToCell: Record<ColumnType, CellType> = {
	[ColumnType.Symbol]: CellType.Symbol,
	[ColumnType.Launched]: CellType.Text,


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
	[ColumnType.ChangePriceYTD]: CellType.Number,
	[ColumnType.ChangePriceYTDPercent]: CellType.Percent,

	[ColumnType.Volume24h]: CellType.Number,
	[ColumnType.Volume24hNorm]: CellType.Number,
	[ColumnType.VolumeRel10d]: CellType.Number,
	[ColumnType.VolumeAvg10d]: CellType.Number,
	[ColumnType.VolumeAvg50d]: CellType.Number,

	[ColumnType.MarketCap24h]: CellType.Number,
	[ColumnType.MarketCapRank]: CellType.Text,
	[ColumnType.MarketCapFullyDiluted]: CellType.Number,
	[ColumnType.MarketCapChange24h]: CellType.Number,
	[ColumnType.MarketCapChange24hPercent]: CellType.Percent,
	[ColumnType.CirculatingSupply]: CellType.Number,
	[ColumnType.TotalSupply]: CellType.Number,
	[ColumnType.MaxSupply]: CellType.Number,

	[ColumnType.AllTimeHigh]: CellType.Number,
	[ColumnType.AllTimeHighChangePercent]: CellType.Percent,
	[ColumnType.AllTimeHighDate]: CellType.Text,
	[ColumnType.AllTimeLow]: CellType.Number,
	[ColumnType.AllTimeLowChangePercent]: CellType.Percent,
	[ColumnType.AllTimeLowDate]: CellType.Text,

	[ColumnType.RSIValue]: CellType.Number,
	[ColumnType.RSIChart]: CellType.SvgChart,

	[ColumnType.Beta5y]: CellType.Number,

	[ColumnType.LastDividend]: CellType.Number,

	[ColumnType.Employees]: CellType.Text,
	[ColumnType.IpODate]: CellType.Text,
	[ColumnType.Sector]: CellType.Text,
	[ColumnType.Industry]: CellType.Text,

	[ColumnType.Source]: CellType.Text,

	[ColumnType.ListingDate]: CellType.Text,

	[ColumnType.UpdateDate]: CellType.Text,

	[ColumnType.PriceOpen]: CellType.Number,
	[ColumnType.PriceClose]: CellType.Number,

	[ColumnType.Volatility]: CellType.Label,
	[ColumnType.TrustScore]: CellType.Score,
	[ColumnType.Open]: CellType.Open,
	[ColumnType.Incentive]: CellType.Check,
	[ColumnType.MarketHours]: CellType.Schedule,
	[ColumnType.Coins]: CellType.Number,
	[ColumnType.Pairs]: CellType.Number,
	[ColumnType.DEXRank]: CellType.Number,
	[ColumnType.Country]: CellType.Text,
	[ColumnType.NextClosedDay]: CellType.Text,

	[ColumnType.Performance]: CellType.Percent,

	[ColumnType.AnalystRating]: CellType.Text,
	[ColumnType.VolumeRel24h]: CellType.Number,
	[ColumnType.VolumeRelAvg50d]: CellType.Number,
	[ColumnType.PriceEarnings]: CellType.Number,
	[ColumnType.EpsDil12mo]: CellType.Number,
	[ColumnType.EpsDilAvg50d]: CellType.Number,
	[ColumnType.EpsDilGrowth12mo]: CellType.Number,
	[ColumnType.EpsDilGrowthAvg50d]: CellType.Number,
	[ColumnType.DividendYield]: CellType.Number,
};

export type ColumnToCell = {
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.Launched]: ITextCell;

	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.PriceMin24h]: INumberCell;
	[ColumnType.PriceMax24h]: INumberCell;
	[ColumnType.PriceMin1y]: INumberCell;
	[ColumnType.PriceMax1y]: INumberCell;
	[ColumnType.PriceAvg50d]: INumberCell;
	[ColumnType.PriceAvg200d]: INumberCell;
	[ColumnType.Price1yRange]: IRangeCell;

	[ColumnType.Price24hChart]: ISvgChartCell;
	[ColumnType.Price7dChart]: ISvgChartCell;
	[ColumnType.Price30dChart]: ISvgChartCell;

	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.ChangePrice1hPercent]: IPercentCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.ChangePrice7dPercent]: IPercentCell;
	[ColumnType.ChangePrice30dPercent]: IPercentCell;
	[ColumnType.ChangePriceYTD]: INumberCell;
	[ColumnType.ChangePriceYTDPercent]: IPercentCell;

	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.Volume24hNorm]: INumberCell;
	[ColumnType.VolumeRel10d]: INumberCell;
	[ColumnType.VolumeAvg10d]: INumberCell;
	[ColumnType.VolumeAvg50d]: INumberCell;

	[ColumnType.MarketCap24h]: INumberCell;
	[ColumnType.MarketCapRank]: ITextCell;
	[ColumnType.MarketCapFullyDiluted]: INumberCell;
	[ColumnType.MarketCapChange24h]: INumberCell;
	[ColumnType.MarketCapChange24hPercent]: IPercentCell;
	[ColumnType.CirculatingSupply]: INumberCell;
	[ColumnType.TotalSupply]: INumberCell;
	[ColumnType.MaxSupply]: INumberCell;

	[ColumnType.AllTimeHigh]: INumberCell;
	[ColumnType.AllTimeHighChangePercent]: IPercentCell;
	[ColumnType.AllTimeHighDate]: ITextCell;
	[ColumnType.AllTimeLow]: INumberCell;
	[ColumnType.AllTimeLowChangePercent]: IPercentCell;
	[ColumnType.AllTimeLowDate]: ITextCell;

	[ColumnType.RSIValue]: INumberCell;
	[ColumnType.RSIChart]: ISvgChartCell;

	[ColumnType.Beta5y]: INumberCell;

	[ColumnType.LastDividend]: INumberCell;

	[ColumnType.Employees]: ITextCell;
	[ColumnType.IpODate]: ITextCell;
	[ColumnType.Sector]: ITextCell;
	[ColumnType.Industry]: ITextCell;

	[ColumnType.Source]: ITextCell;

	[ColumnType.ListingDate]: ITextCell;

	[ColumnType.UpdateDate]: ITextCell;

	[ColumnType.PriceOpen]: INumberCell;
	[ColumnType.PriceClose]: INumberCell;

	[ColumnType.Volatility]: ILableCell;
	[ColumnType.TrustScore]: IScoreCell;
	[ColumnType.Open]: IOpenCell;
	[ColumnType.Incentive]: ICheckCell;
	[ColumnType.MarketHours]: IScheduleCell;
	[ColumnType.Coins]: INumberCell;
	[ColumnType.Pairs]: INumberCell;
	[ColumnType.DEXRank]: INumberCell;
	[ColumnType.Country]: ITextCell;
	[ColumnType.NextClosedDay]: ITextCell;

	[ColumnType.Performance]: IPercentCell;

	[ColumnType.AnalystRating]: ITextCell;
	[ColumnType.VolumeRel24h]: INumberCell;
	[ColumnType.VolumeRelAvg50d]: INumberCell;
	[ColumnType.PriceEarnings]: INumberCell;
	[ColumnType.EpsDil12mo]: INumberCell;
	[ColumnType.EpsDilAvg50d]: INumberCell;
	[ColumnType.EpsDilGrowth12mo]: INumberCell;
	[ColumnType.EpsDilGrowthAvg50d]: INumberCell;
	[ColumnType.DividendYield]: INumberCell;
};

export type CellByColumn<T extends ColumnType> = ColumnToCell[T];

export interface IDecodeTickerId {
	symbolType: SymbolType;
	tickerId: string;
}

export function decodeTickerId(tickerId: string): IDecodeTickerId | null {
	const [symbolType, id] = tickerId.split('-');

	if (symbolType && id && isValidSymbolType(symbolType)) {
		return {
			symbolType,
			tickerId: id,
		};
	}

	return null;
}

function isValidSymbolType(value: string): value is SymbolType {
	return Object.values(SymbolType).includes(value as SymbolType);
}

export function createTickerId(symbolType: SymbolType, payload: string): string {
	return `${symbolType}-${payload}`;
}

export function createTickerIdFromCell(symbolCell: ISymbolCell): string {
	const { symbolType } = symbolCell;
	let idPayload = '';

	switch (symbolCell.symbolType) {
		case SymbolType.Crypto:
			idPayload = createTickerIdCrypto(symbolCell.ticker, symbolCell.blockchain);
			break;
		case SymbolType.Stock:
			idPayload = createTickerIdStock(symbolCell.ticker);
			break;
		case SymbolType.Index:
			idPayload = createTickerIdIndex(symbolCell.ticker);
			break;
		case SymbolType.Commodity:
			idPayload = createTickerIdCommodity(symbolCell.ticker);
			break;
		case SymbolType.Forex:
			idPayload = createTickerIdForex(symbolCell.leftTicker, symbolCell.rightTicker);
			break;
		case SymbolType.Etf:
			idPayload = createTickerIdEtf(symbolCell.ticker);
			break;
		default:
			idPayload = symbolCell.text;
	}

	return createTickerId(symbolType, idPayload);
}

export function createTickerIdCrypto(ticker: string, blockchain: string): string {
	return ticker + '_' + blockchain.replace(' ', '');
}

export function createTickerIdStock(ticker: string): string {
	return ticker;
}

export function createTickerIdIndex(ticker: string): string {
	return ticker;
}

export function createTickerIdCommodity(ticker: string): string {
	return ticker;
}

export function createTickerIdForex(leftTicker: string, rightTicker: string): string {
	return leftTicker + '_' + rightTicker;
}

export function createTickerIdEtf(ticker: string): string {
	return ticker;
}

export function mapSymbolTypeToMarketType(st: SymbolType): MarketType | null {
	switch (st) {
		case SymbolType.Crypto:
			return MarketType.Crypto;
		case SymbolType.Stock:
			return MarketType.Stock;
		case SymbolType.Index:
			return MarketType.Indices;
		case SymbolType.Commodity:
			return MarketType.Commodities;
		case SymbolType.Forex:
			return MarketType.Forex;
		case SymbolType.Etf:
			return MarketType.Etf;
		default:
			return null;
	}
}

export function resolveMarketTypeFromTicker(selectedTicker: string) {
	const { symbolType } = decodeTickerId(selectedTicker) || {};
	if (!symbolType) {
		return;
	}

	const marketType = mapSymbolTypeToMarketType(symbolType);
	if (!marketType) {
		return;
	}

	return marketType;
}
