import {
	ColumnType,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	type ITextCell,
	type ISvgChartCell,
	type TableRow,
	type ITableColumn,
	buildColumns,
} from '@/modules/cell';
import { type Filters, type IFilterValue, type IFilterState, type IIcon } from './filter';
import { IconIds } from '@/shared/ui/icon';

export type CommoditiesTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.PriceMin24h]: INumberCell;
	[ColumnType.PriceMax24h]: INumberCell;
	[ColumnType.PriceMin1y]: INumberCell;
	[ColumnType.PriceMax1y]: INumberCell;
	[ColumnType.PriceAvg50d]: INumberCell;
	[ColumnType.PriceAvg200d]: INumberCell;
	[ColumnType.PriceOpen]: INumberCell;
	[ColumnType.PriceClose]: INumberCell;
	[ColumnType.UpdateDate]: ITextCell;
	[ColumnType.Price24hChart]: ISvgChartCell;
}>;

export const COMMODITIES_ALL_COLUMNS: ITableColumn[] =
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
			columnType: ColumnType.ChangePrice24h,
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
			columnType: ColumnType.Volume24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMin24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMax24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMin1y,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMax1y,
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
			columnType: ColumnType.PriceAvg200d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceOpen,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceClose,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.UpdateDate,
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

enum CommoditiesFilters {
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

export const COMMODITIES_FILTERS: Filters = {
	[CommoditiesFilters.Status]: {
		values: STATUS_FILTER_VALUES,
		state: STATUS_FILTER_DEFAULT,
	},
};
