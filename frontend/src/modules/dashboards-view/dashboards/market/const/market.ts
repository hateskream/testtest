import type { ITableColumn, ITableRowValueType } from '../model';
import { setPositionColumns } from '../utils';

export const INITIAL_ALL_TABLE_COLUMNS: ITableColumn[] = setPositionColumns([
	{
		columnName: 'symbol',
		displayColumnName: 'Symbol',
		displayShortColumnName: 'Symbol',
		isToggleable: false,
		isDraggable: false,
		isShow: true,
		position: 0,
		type: 'image-string',
		group: {
			name: 'symbol',
		},
	},
	{
		columnName: 'price',
		displayColumnName: 'Price',
		displayShortColumnName: 'Price',
		group: {
			name: 'price',
		},
		isShow: true,
		isToggleable: true,
		isDraggable: true,
		position: 1,
		type: 'number',
	},
	{
		columnName: 'chg24h',
		displayColumnName: 'Change 24h%',
		displayShortColumnName: 'Chg 24h%',
		isShow: true,
		isToggleable: true,
		isDraggable: true,
		position: 2,
		type: 'percent',
		group: {
			name: 'change',
			order: 2,
		},
	},
	{
		columnName: 'chg1h',
		displayColumnName: 'Change 1h%',
		displayShortColumnName: 'Chg 1h%',
		isShow: false,
		isToggleable: true,
		isDraggable: true,
		position: 3,
		type: 'percent',
		group: {
			name: 'change',
			order: 1,
		},
	},
	{
		columnName: 'chg7d',
		displayColumnName: 'Change 7d%',
		displayShortColumnName: 'Chg 7d%',
		isShow: false,
		isToggleable: true,
		isDraggable: true,
		position: 4,
		type: 'percent',
		group: {
			name: 'change',
		},
	},
	{
		columnName: 'volume24h',
		displayColumnName: 'Volume 24h',
		displayShortColumnName: 'Vol 24h',
		isShow: true,
		isToggleable: true,
		isDraggable: true,
		position: 5,
		type: 'number',
		group: {
			name: 'volume',
		},
	},
	{
		columnName: 'marketCap24h',
		displayColumnName: 'Market cap 24h',
		displayShortColumnName: 'MCap 24h',
		isShow: true,
		isToggleable: true,
		isDraggable: true,
		position: 6,
		type: 'number',
		group: {
			name: 'MCap',
		},
	},
	{
		columnName: 'listingDate',
		displayColumnName: 'Listing Date',
		displayShortColumnName: 'Listing Date',
		isShow: true,
		isToggleable: true,
		isDraggable: true,
		position: 7,
		type: 'date',
		group: {
			name: 'Date',
		},
	},
]);

export const INITIAL_ACTIVE_TABLE_COLUMNS: ITableColumn[] = setPositionColumns(
	INITIAL_ALL_TABLE_COLUMNS.filter(item => item.isShow),
);

export const ACCEPT_COLUMNS_TYPES_SORT: ITableRowValueType[] = [
	'image-string',
	'string',
	'number',
	'percent',
	'date',
];
