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
	Symbol = 'Symbol',
	Price = 'Price',
	PriceChart = 'Price chart',
	PriceChange = 'Price change',
	MarketCap = 'Market cap',
	LastDividend = 'Last dividend',
	Beta = 'Beta',
	Volume = 'Volume',
	Company = 'Company',
	Source = 'Source',
	Other = 'Other',
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

	[ColumnType.Price24hChart]: Group.PriceChart,
	[ColumnType.Price7dChart]: Group.PriceChart,
	[ColumnType.Price30dChart]: Group.PriceChart,

	[ColumnType.ChangePrice24h]: Group.PriceChange,
	[ColumnType.ChangePrice1hPercent]: Group.PriceChange,
	[ColumnType.ChangePrice24hPercent]: Group.PriceChange,
	[ColumnType.ChangePrice7dPercent]: Group.PriceChange,
	[ColumnType.ChangePrice30dPercent]: Group.PriceChange,

	[ColumnType.Volume24h]: Group.Volume,
	[ColumnType.VolumeRel10d]: Group.Volume,
	[ColumnType.VolumeAvg10d]: Group.Volume,
	[ColumnType.VolumeAvg50d]: Group.Volume,

	[ColumnType.MarketCap24h]: Group.MarketCap,

	[ColumnType.RSIValue]: Group.Other,
	[ColumnType.RSIChart]: Group.Other,

	[ColumnType.Beta5y]: Group.Beta,

	[ColumnType.LastDividend]: Group.LastDividend,

	[ColumnType.Employees]: Group.Company,
	[ColumnType.IpODate]: Group.Company,
	[ColumnType.Sector]: Group.Company,
	[ColumnType.Industry]: Group.Company,

	[ColumnType.Source]: Group.Source,

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

export function setPositionColumns(cols: ITableColumn[]): ITableColumn[] {
	return cols.map((item, idx) => ({ ...item, position: idx }));
}

export function buildColumns(cols: INotFullCol[]): ITableColumn[] {
	return setPositionColumns(
		cols
			.map(item => (
				{
					...createTableColumn(item),
				}),
			),
	);
}

export function getShow(cols: ITableColumn[]) {
	return setPositionColumns(cols.filter(item => item.isShow));
}
