import { ColumnType } from '@/modules/cell';
import { buildColumns, getShow, type ITableColumn } from '../model';

export const INITIAL_ALL_TABLE_COLUMNS: ITableColumn[] =
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
			columnType: ColumnType.MarketCap24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.ListingDate,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
	]);

export const INITIAL_ACTIVE_TABLE_COLUMNS: ITableColumn[] = getShow(INITIAL_ALL_TABLE_COLUMNS);
