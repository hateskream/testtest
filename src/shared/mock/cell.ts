import {
	type Cell,
	CellType,
	type ColumnToCell,
	ColumnType,
	type ColumnWithoutSymbol,
	createTickerId,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type INumberCell,
	type IPercentCell,
	type IPlaneTextSymbolCell,
	type IRangeCell,
	type IStockSymbolCell,
	type ISymbolCell,
	Magnitude,
	type RowCells,
	Status,
	SymbolType,
	type TableRow,
	Trend,
} from '@/modules/cell';
import { allTickers } from '@/shared/mock/all-tickers.ts';

const allCellByColumn: Record<ColumnWithoutSymbol, Cell> = 	{
	[ColumnType.PriceCurrent]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceCurrent,
		value: '45632',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.PriceMin24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMin24h,
		value: '44892',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMax24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMax24h,
		value: '46120',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMin1y]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMin1y,
		value: '15476',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMax1y]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMax1y,
		value: '73750',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceAvg50d]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceAvg50d,
		value: '42150',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceAvg200d]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceAvg200d,
		value: '38925',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceOpen]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceOpen,
		value: '45120',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceClose]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceClose,
		value: '45632',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.Price1yRange]: {
		cellType: CellType.Range,
		columnType: ColumnType.Price1yRange,
		currencySymbol: '$',
		startValue: '15476',
		endValue: '73750',
		startMagnitude: Magnitude.THOUSAND,
		endMagnitude: Magnitude.THOUSAND,
	},
	[ColumnType.Price24hChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price24hChart,
		src: '/images/mock/chart-btc-24h.svg',
	},
	[ColumnType.Price7dChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price7dChart,
		src: '/images/mock/chart-btc-7d.svg',
	},
	[ColumnType.Price30dChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price30dChart,
		src: '/images/mock/chart-btc-30d.svg',
	},
	[ColumnType.ChangePrice24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.ChangePrice24h,
		value: '511',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice1hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice1hPercent,
		value: '12',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice24hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice24hPercent,
		value: '13',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice7dPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice7dPercent,
		value: '25',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice30dPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice30dPercent,
		value: '47',
		trend: Trend.UP,
	},
	[ColumnType.Volume24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.Volume24h,
		value: '42',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.VolumeRel10d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeRel10d,
		value: '15',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.VolumeAvg10d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeAvg10d,
		value: '73',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.VolumeAvg50d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeAvg50d,
		value: '18',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.MarketCap24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCap24h,
		value: '50',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapRank]: {
		cellType: CellType.Text,
		columnType: ColumnType.MarketCapRank,
		value: '1',
	},
	[ColumnType.MarketCapFullyDiluted]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCapFullyDiluted,
		value: '957',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapChange24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCapChange24h,
		value: '10',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapChange24hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.MarketCapChange24hPercent,
		value: '13',
		trend: Trend.UP,
	},
	[ColumnType.CirculatingSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.CirculatingSupply,
		value: '65',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.TotalSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.TotalSupply,
		value: '19',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.MaxSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.MaxSupply,
		value: '21',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeHigh]: {
		cellType: CellType.Number,
		columnType: ColumnType.AllTimeHigh,
		value: '73750',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeHighChangePercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.AllTimeHighChangePercent,
		value: '38',
		trend: Trend.DOWN,
	},
	[ColumnType.AllTimeHighDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.AllTimeHighDate,
		value: '2021-11-10',
	},
	[ColumnType.AllTimeLow]: {
		cellType: CellType.Number,
		columnType: ColumnType.AllTimeLow,
		value: '81',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeLowChangePercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.AllTimeLowChangePercent,
		value: '81',
		trend: Trend.UP,
	},
	[ColumnType.AllTimeLowDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.AllTimeLowDate,
		value: '2013-07-05',
	},
	[ColumnType.RSIValue]: {
		cellType: CellType.Number,
		columnType: ColumnType.RSIValue,
		value: '58',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.RSIChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.RSIChart,
		src: '/images/mock/rsi-btc.svg',
	},
	[ColumnType.Beta5y]: {
		cellType: CellType.Number,
		columnType: ColumnType.Beta5y,
		value: '23',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.LastDividend]: {
		cellType: CellType.Number,
		columnType: ColumnType.LastDividend,
		value: '54',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.Employees]: {
		cellType: CellType.Text,
		columnType: ColumnType.Employees,
		value: 'N/A',
	},
	[ColumnType.IpODate]: {
		cellType: CellType.Text,
		columnType: ColumnType.IpODate,
		value: '2009-01-03',
	},
	[ColumnType.Sector]: {
		cellType: CellType.Text,
		columnType: ColumnType.Sector,
		value: 'Cryptocurrency',
	},
	[ColumnType.Industry]: {
		cellType: CellType.Text,
		columnType: ColumnType.Industry,
		value: 'Digital Currency',
	},
	[ColumnType.Source]: {
		cellType: CellType.Text,
		columnType: ColumnType.Source,
		value: 'CoinGecko',
	},
	[ColumnType.ListingDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.ListingDate,
		value: '2013-04-28',
	},
	[ColumnType.UpdateDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.UpdateDate,
		value: '2024-01-15 10:30:15',
	},
	[ColumnType.Volatility]: {
		cellType: CellType.Label,
		columnType: ColumnType.Volatility,
		value: 'High',
		status: Status.CAUTION,
	},
};

export interface ITickerData {
	left: string;
	right: string;
}

const tickerCount = 50;

export function generateRows<T extends RowCells = RowCells>(
	type: SymbolType,
	cols: ColumnWithoutSymbol[],
	countRows = tickerCount,
): TableRow<T>[] {
	return allTickers[type]
		.slice(0, countRows)
		.map(tickerData => {
			const tickerCell = createSymbolCell(type, tickerData);

			return {
				tickerId: createTickerId(tickerCell),
				[ColumnType.Symbol]: tickerCell,
				...Object
					.fromEntries(
						cols
							.map(col => [col, allCellByColumn[col]]),
					),
			} as TableRow<T>;
		});
}

type AllRows = {
	tickerId: string;
} & ColumnToCell;

export function generateAllRows() {
	return Object
		.values(SymbolType)
		.flatMap(type =>
			generateRows(
				type,
				Object
					.keys(allCellByColumn) as ColumnWithoutSymbol[],
			),
		) as AllRows[];
}

export function randomizeCellData(cell: Cell): Cell {
	switch (cell.cellType) {
		case CellType.Number:
			return randomizeNumberCell(cell as INumberCell);
		case CellType.Percent:
			return randomizePercentCell(cell as IPercentCell);
		case CellType.Range:
			return randomizeRangeCell(cell as IRangeCell);
		default:
			return cell;
	}
}

function randomizeNumberCell(cell: INumberCell): INumberCell {
	return {
		...cell,
		value: (86000 + Math.random() * 2000).toFixed(2),
	};
}

function randomizePercentCell(cell: IPercentCell): IPercentCell {
	return {
		...cell,
		value: (Math.random() * 100).toFixed(2),
	};
}

function randomizeRangeCell(cell: IRangeCell): IRangeCell {
	return {
		...cell,
		startValue: (86000 + Math.random() * 2000).toFixed(2),
		endValue: (86000 + Math.random() * 2000).toFixed(2),
	};
}

const symbolTypeToCell: Record<SymbolType, (td: ITickerData) => ISymbolCell> = {
	[SymbolType.Crypto]: createCryptoSymbolCell,
	[SymbolType.Stock]: createStockSymbolCell,
	[SymbolType.Index]: createIndexSymbolCell,
	[SymbolType.Commodity]: createCommoditySymbolCell,
	[SymbolType.Forex]: createForexSymbolCell,
	[SymbolType.PlaneText]: createPlainTextCell,
};

function createSymbolCell(type: SymbolType, tickerData: ITickerData): ISymbolCell {
	return symbolTypeToCell[type](tickerData);
}

function createCryptoSymbolCell(tickerData: ITickerData): ICryptoSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Crypto,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		blockchain: tickerData.right,
	};
}

function createStockSymbolCell(tickerData: ITickerData): IStockSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Stock,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		companyName: tickerData.right,
	};
}

function createIndexSymbolCell(tickerData: ITickerData): IIndexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Index,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		indexName: tickerData.right,
	};
}

function createCommoditySymbolCell(tickerData: ITickerData): ICommoditySymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Commodity,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		commodityName: tickerData.right,
	};
}

function createForexSymbolCell(tickerData: ITickerData): IForexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Forex,
		leftTicker: tickerData.left,
		rightTicker: tickerData.right,
		leftSrcImg: 'wrong.png',
		rightSrcImg: 'wrong.png',
	};
}

function createPlainTextCell(tickerData: ITickerData): IPlaneTextSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.PlaneText,
		text: tickerData.left,
	};
}
