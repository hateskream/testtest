import { ColumnType } from '@/modules/cell';
import { buildColumns, getShow, type ITableColumn, type ITableRowValueType } from '../model';

export const INITIAL_ALL_TABLE_COLUMNS: ITableColumn[] =
	buildColumns([
		{
			columnType: ColumnType.Symbol,
			isToggleable: false,
			isDraggable: false,
			isShow: true,
			group: {
				name: 'symbol',
			},
		},
		{
			columnType: ColumnType.PriceCurrent,
			group: {
				name: 'price',
			},
			isShow: true,
			isToggleable: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice24hPercent,
			isShow: true,
			isToggleable: true,
			isDraggable: true,
			group: {
				name: 'change',
				order: 2,
			},
		},
		{
			columnType: ColumnType.Volume24h,
			isShow: true,
			isToggleable: true,
			isDraggable: true,
			group: {
				name: 'volume',
			},
		},
		{
			columnType: ColumnType.MarketCap24h,
			isShow: true,
			isToggleable: true,
			isDraggable: true,
			group: {
				name: 'MCap',
			},
		},
		{
			columnType: ColumnType.ListingDate,
			isShow: true,
			isToggleable: true,
			isDraggable: true,
			group: {
				name: 'Date',
			},
		},
	]);

export const INITIAL_ACTIVE_TABLE_COLUMNS: ITableColumn[] = getShow(INITIAL_ALL_TABLE_COLUMNS);

export const ACCEPT_COLUMNS_TYPES_SORT: ITableRowValueType[] = [
	'image-string',
	'string',
	'number',
	'percent',
	'date',
];
