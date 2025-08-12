import { ColumnType, CellType, columnDisplay, columnToCell } from '@/modules/cell';

export interface ITableColumn {
	order: number;
	isShow: boolean;
	displayColumnName: string;
	displayShortColumnName: string;
	isDraggable: boolean;
	group: {
		order: number;
		name: string;
	};
	columnType: ColumnType;
	type: CellType;
}

enum Group {
	Symbol = 'symbol',
	Price = 'price',
	Other = 'other',
}

const columnTypeToGroup: Record<ColumnType, Group> = {
	[ColumnType.Symbol]: Group.Symbol,

	[ColumnType.PriceCurrent]: Group.Price,
	[ColumnType.PriceMin24h]: Group.Other,
	[ColumnType.PriceMax24h]: Group.Other,
	[ColumnType.PriceMin1y]: Group.Other,
	[ColumnType.PriceMax1y]: Group.Other,
	[ColumnType.PriceAvg50d]: Group.Other,
	[ColumnType.PriceAvg200d]: Group.Other,
	[ColumnType.Price1yRange]: Group.Other,

	[ColumnType.Price24hChart]: Group.Other,
	[ColumnType.Price7dChart]: Group.Other,
	[ColumnType.Price30dChart]: Group.Other,

	[ColumnType.ChangePrice24h]: Group.Other,
	[ColumnType.ChangePrice1hPercent]: Group.Other,
	[ColumnType.ChangePrice24hPercent]: Group.Other,
	[ColumnType.ChangePrice7dPercent]: Group.Other,
	[ColumnType.ChangePrice30dPercent]: Group.Other,

	[ColumnType.Volume24h]: Group.Other,
	[ColumnType.VolumeRel10d]: Group.Other,
	[ColumnType.VolumeAvg10d]: Group.Other,

	[ColumnType.MarketCap24h]: Group.Other,

	[ColumnType.RSIValue]: Group.Other,
	[ColumnType.RSIChart]: Group.Other,

	[ColumnType.Beta5y]: Group.Other,

	[ColumnType.LastDividend]: Group.Other,

	[ColumnType.Employees]: Group.Other,
	[ColumnType.IpODate]: Group.Other,
	[ColumnType.Sector]: Group.Other,
	[ColumnType.Industry]: Group.Other,

	[ColumnType.Source]: Group.Other,

	[ColumnType.ListingDate]: Group.Other,

	[ColumnType.UpdateDate]: Group.Other,

	[ColumnType.OpenPrice]: Group.Other,
	[ColumnType.ClosePrice]: Group.Other,
};

interface INotFullCol {
	isShow: boolean;
	isDraggable: boolean;
	groupOrder: number;
	columnType: ColumnType;
}

function createTableColumn(col: INotFullCol): ITableColumn {
	const display = columnDisplay[col.columnType];

	return {
		...col,
		group: {
			order: col.groupOrder,
			name: columnTypeToGroup[col.columnType],
		},
		type: columnToCell[col.columnType],
		order: 0,
		displayColumnName: display.name,
		displayShortColumnName: display.shortName,
	};
}

export function buildColumns(cols: INotFullCol[]): ITableColumn[] {
	return cols.map((item, idx) => ({
		...createTableColumn(item),
		order: idx,
	}));
}

export function getShow(cols: ITableColumn[]) {
	return cols
		.filter(item => item.isShow)
		.map((item, idx) => ({
			...item,
			order: idx,
		}));
}
