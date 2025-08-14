import {
	ColumnType,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	type ITextCell,
	type ISvgChartCell,
} from '@/modules/cell';
import type { TableRow } from './row';
import { type ITableColumn, buildColumns } from './column';

export type ForexTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.PriceAvg50d]: INumberCell;
	// [ColumnType.Price1yRange]: IRangeCell;
	[ColumnType.MarketCap24h]: INumberCell;
	[ColumnType.Beta5y]: INumberCell;
	[ColumnType.LastDividend]: INumberCell;
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.VolumeAvg10d]: INumberCell;
	[ColumnType.Employees]: ITextCell;
	[ColumnType.IpODate]: ITextCell;
	[ColumnType.Sector]: ITextCell;
	[ColumnType.Industry]: ITextCell;
	[ColumnType.Source]: ITextCell;
	[ColumnType.Price24hChart]: ISvgChartCell;
}>;

export const FOREX_ALL_COLUMNS: ITableColumn[] =
	buildColumns([
		{
			columnType: ColumnType.Symbol,
			isDraggable: false,
			isShow: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceCurrent,
			groupOrder: 0,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice24hPercent,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Volume24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceAvg50d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Price1yRange,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.MarketCap24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Beta5y,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.LastDividend,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.ChangePrice24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.VolumeAvg10d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Employees,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.IpODate,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Sector,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Industry,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Source,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Price24hChart,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
	]);
