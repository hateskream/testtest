import type { LayoutItem } from 'grid-layout-plus';

import { columnDisplay } from './display';
import { ColumnType, CellType, columnToCell } from './domain';

export interface ITableColumn {
	order: number;
	isShow: boolean;
	displayColumnName: string;
	displayShortColumnName: string;
	isDraggable: boolean;
	minWidth: string | number;
	maxWidth: string | number;
	curWidth?: number;
	group: {
		order: number;
		name: string;
	};
	columnType: ColumnType;
	type: CellType;
	width?: number;
	extended?: boolean;
}

interface INotFullCol {
	isShow: boolean;
	isDraggable: boolean;
	groupOrder: number;
	columnType: ColumnType;
	minWidth?: number | string;
	maxWidth?: number | string;
	width?: number | string;
	extended?: boolean;
}

function createTableColumn(col: INotFullCol): ITableColumn {
	const display = columnDisplay[col.columnType];
	return {
		...col,
		group: {
			order: col.groupOrder,
			name: display.groupName,
		},
		type: columnToCell[col.columnType],
		order: 0,
		displayColumnName: display.columnName,
		displayShortColumnName: display.settingsName,
		minWidth: col.minWidth ?? display.minWidth,
		maxWidth: col.maxWidth ?? display.maxWidth,
		width: col.width ?? display.width,
		...(col.extended ? { extended: col.extended } : {}),
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

type GroupedTableColumns = Record<string, ITableColumn[]>;

export function groupTableColumns(cols: ITableColumn[]): GroupedTableColumns {
	const grouped: { [x: string]: ITableColumn[] } = {};

	cols.forEach(column => {
		if (!Array.isArray(grouped[column.group.name])) {
			grouped[column.group.name] = [column];
		} else {
			grouped[column.group.name].push(column);
		}
	});

	return grouped;
}

export interface IHydratedColumn {
	columnType: ColumnType;
	isShow: boolean;
	order: number;
}

export function hydrateColumns(columns: ITableColumn[]): IHydratedColumn[] {
	return columns.map(item => ({
		columnType: item.columnType,
		isShow: item.isShow,
		order: item.order,
	}));
}

export function rehydrateColumns(states: IHydratedColumn[], preset: ITableColumn[]): ITableColumn[] {
	try {
		return preset.map(item => {
			const state = findColumn(states, item.columnType);

			return {
				...item,
				order: state.order,
				isShow: state.isShow,
			};
		});
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e);
		return preset;
	}
}

function findColumn(states: IHydratedColumn[], columnType: ColumnType): IHydratedColumn {
	const state = states.find(col => col.columnType === columnType);
	if (state) {
		return state;
	}

	throw new Error(`Column ${columnType} not found`);
}
