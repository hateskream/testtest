import type { LayoutItem } from 'grid-layout-plus';

import { columnDisplay } from './display';
import { ColumnType, CellType, columnToCell } from './domain';

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
	width?: number;
}

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
			name: display.settingsName,
		},
		type: columnToCell[col.columnType],
		order: 0,
		displayColumnName: display.columnName,
		displayShortColumnName: display.settingsName,
		// TODO: tooltip
		// tooltip: display.tooltip,
	};
}

function setPositionColumns(cols: ITableColumn[]): ITableColumn[] {
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

export function toggleShowTableColumns(
	cols: ITableColumn[],
	columnType: ColumnType,
): ITableColumn[] {
	return cols.map(column =>
		column.columnType === columnType
			? {
				...column,
				isShow: !column.isShow,
			}
			: column,
	);
}

export interface IGridLayoutColumn extends LayoutItem {
	data: ITableColumn;
}

export function updatePositionsColumns(
	columns: ITableColumn[],
	layout: IGridLayoutColumn[],
	columnName: string,
	y: number,
): ITableColumn[] {
	return setPositionColumns(
		[
			columns[0],
			...layout.map(item => ({
				...item.data,
				position: item.data.columnType === columnName ? y : item.y,
			})),
		].sort((a, b) => a.order - b.order),
	);
}
