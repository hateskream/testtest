import {
	ColumnType,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	type ITextCell,
	type ISvgChartCell,
	type IRangeCell,
} from '@/modules/cell';
import type { TableRow } from './row';
import { type ITableColumn, buildColumns } from './column';
import { type Filters, type IFilterValue, type IFilterState, type IIcon } from './filter';
import { IconIds } from '@/shared/ui/icon';

export type StockTableRow = TableRow<{
	[ColumnType.Symbol]:ISymbolCell;
	[ColumnType.PriceCurrent]:INumberCell;
	[ColumnType.Price1yRange]:IRangeCell;
	[ColumnType.MarketCap24h]:INumberCell;
	[ColumnType.Beta5y]:INumberCell;
	[ColumnType.LastDividend]:INumberCell;
	[ColumnType.ChangePrice24hPercent]:IPercentCell;
	[ColumnType.ChangePrice24h]:INumberCell;
	[ColumnType.Volume24h]:INumberCell;
	[ColumnType.VolumeAvg50d]:INumberCell;
	[ColumnType.Employees]:ITextCell;
	[ColumnType.IpODate]:ITextCell;
	[ColumnType.Industry]:ITextCell;
	[ColumnType.Sector]:ITextCell;
	[ColumnType.Source]:ITextCell;
	[ColumnType.Price24hChart]:ISvgChartCell;
}>;

export const STOCK_ALL_COLUMNS: ITableColumn[] =
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
			columnType: ColumnType.ChangePrice24hPercent,
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
			columnType: ColumnType.Volume24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.VolumeAvg50d,
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
			columnType: ColumnType.Industry,
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

enum StockFilters {
	Status = 'status',
}

enum Status {
	Gainers = 'Gainers',
	Losers = 'Losers',
	New = 'New',
	Upcoming = 'Upcoming',
	All = 'none',
}

const StatusToName: Record<Status, string> = {
	[Status.Gainers]: 'Gainers',
	[Status.Losers]: 'Losers',
	[Status.New]: 'New',
	[Status.Upcoming]: 'Upcoming',
	[Status.All]: 'All',
};

const StatusToIcon: Partial<Record<Status, IIcon>> = {
	[Status.Gainers]: {
		id: IconIds.Gainers,
		color: 'rgb(206 255 139 / 100%)',
	},
	[Status.Losers]: {
		id: IconIds.Loosers,
		color: 'rgb(248 89 97 / 50%)',
	},
};

const STATUS_FILTER_VALUES: IFilterValue[] = [
	{
		name: StatusToName[Status.Gainers],
		value: Status.Gainers,
		icon: StatusToIcon[Status.Gainers],
	},
	{
		name: StatusToName[Status.Losers],
		value: Status.Losers,
		icon: StatusToIcon[Status.Losers],
	},
	{
		name: StatusToName[Status.New],
		value: Status.New,
	},
	{
		name: StatusToName[Status.Upcoming],
		value: Status.Upcoming,
	},
	{
		name: StatusToName[Status.All],
		value: Status.All,
	},
];

const STATUS_FILTER_DEFAULT: IFilterState = {
	selected: Status.All,
	isFlat: true,
};

export const STOCK_FILTERS: Filters = {
	[StockFilters.Status]: {
		values: STATUS_FILTER_VALUES,
		state: STATUS_FILTER_DEFAULT,
	},
};
