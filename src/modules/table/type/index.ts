// Table column type enum\
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { UnwrapRef } from 'vue';

export enum TableColumnType {
	STRING = 'string',
	NUMBER = 'number',
	DATE = 'date',
	PERCENT = 'percent',
	IMAGE_STRING = 'image-string',
}

export type SortDirection = 'asc' | 'desc' | 'none';

export interface IGenericTableColumn {
	key: string;
	label: string;
	shortLabel?: string;
	position: number;
	sortable: boolean;
	draggable: boolean;
	visible: boolean;
	width?: number;
	minWidth?: number;
	type: TableColumnType;
	group?: {
		name: string;
		displayName: string;
	};
}

export interface ISortConfig {
	columnKey: string;
	direction: 'asc' | 'desc' | 'none';
}

// Cell wrapper interface for consistent data structure
export interface ICellWrapper {
	sortValue: unknown;
	displayValue?: unknown;
	srcValue?: string;
	domain?: string;
	market?: string;
	id?: string;
}

// Generic types using cell wrapper structure
export interface IGenericTableRow<T = Record<string, ICellWrapper>> {
	id: string;
	data: UnwrapRef<T>;
}

export interface IGenericTableSection<T = Record<string, ICellWrapper>> {
	id: string;
	title: string;
	rows: IGenericTableRow<T>[];
	isCollapsed?: boolean;
}

export interface IDragDropEvent<T = Record<string, ICellWrapper>> {
	type: 'moved' | 'added' | 'removed';
	sectionId: string;
	oldIndex?: number;
	newIndex?: number;
	element?: IGenericTableRow<T>;
}

export interface IDragEvent<T = Record<string, ICellWrapper>> {
	added?: {
		newIndex: number;
		element: IGenericTableRow<T>;
	};
	removed?: {
		oldIndex: number;
		element: IGenericTableRow<T>;
	};
	moved?: {
		oldIndex: number;
		newIndex: number;
		element: IGenericTableRow<T>;
	};
}
