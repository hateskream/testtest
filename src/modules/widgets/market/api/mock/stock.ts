import { CellType, ColumnType, Magnitude, SymbolType, Trend } from '@/modules/cell';
import type { ITicker } from '../get-market-stock';


export const mockTickers: ITicker[] = [
	{
		tickerId: 'TSLA',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '1',
			ticker: 'TSLA',
			companyName: 'Tesla,Inc.',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '182.24',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.Price1yRange]: {
			cellType: CellType.Range,
			columnType: ColumnType.Price1yRange,
			currencySymbol: '$',
			startValue: '164.08',
			endValue: '278.56',
			startMagnitude: Magnitude.BILLION,
			endMagnitude: Magnitude.BILLION,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '3.5',
			currencySymbol: '$',
			magnitude: Magnitude.TRILLION,
			trend: Trend.UP,
		},
		[ColumnType.Beta5y]: {
			cellType: CellType.Number,
			columnType: ColumnType.Beta5y,
			value: '1.24',
			currencySymbol: '',
			magnitude: Magnitude.NONE,
			trend: Trend.NEUTRAL,
		},
		[ColumnType.LastDividend]: {
			cellType: CellType.Number,
			columnType: ColumnType.LastDividend,
			value: '0.99',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.NEUTRAL,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '2.79',
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '4.79',
			currencySymbol: '',
			magnitude: Magnitude.NONE,
			trend: Trend.UP,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '2.51',
			currencySymbol: '$',
			magnitude: Magnitude.MILLION,
			trend: Trend.UP,
		},
		[ColumnType.VolumeAvg50d]: {
			cellType: CellType.Number,
			columnType: ColumnType.VolumeAvg50d,
			value: '50.54',
			currencySymbol: '',
			magnitude: Magnitude.MILLION,
			trend: Trend.UP,
		},
		[ColumnType.Employees]: {
			cellType: CellType.Text,
			columnType: ColumnType.Employees,
			value: '164,000',
		},
		[ColumnType.IpODate]: {
			cellType: CellType.Text,
			columnType: ColumnType.IpODate,
			value: '12.12.1980',
		},
		[ColumnType.Sector]: {
			cellType: CellType.Text,
			columnType: ColumnType.Sector,
			value: 'Technology',
		},
		[ColumnType.Industry]: {
			cellType: CellType.Text,
			columnType: ColumnType.Industry,
			value: 'Consumer Electronics',
		},
		[ColumnType.Source]: {
			cellType: CellType.Text,
			columnType: ColumnType.Source,
			value: 'NASDAQ',
		},
		[ColumnType.Price24hChart]: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '/chart.svg',
		},
	},
];
