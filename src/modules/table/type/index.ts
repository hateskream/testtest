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
	type: 'string' | 'number' | 'date' | 'percent' | 'image-string';
	group?: {
		name: string;
		displayName: string;
	};
}

export interface IGenericTableRow {
	id: string;
	data: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface IGenericTableSection {
	id: string;
	title: string;
	isCollapsed: boolean;
	rows: IGenericTableRow[];
}

export interface ISortConfig {
	columnKey: string;
	direction: 'asc' | 'desc' | 'none';
}

export type SortDirection = 'asc' | 'desc' | 'none';

export interface IDragDropEvent {
	type: 'moved' | 'added' | 'removed';
	sectionId: string;
	oldIndex?: number;
	newIndex?: number;
	element?: IGenericTableRow;
}

export interface ICellData {
	type: string;
	value: unknown;
	srcValue?: string;
	domain?: string;
	market?: string;
	id: string;
}

export interface IDragEvent {
	added?: {
		newIndex: number;
		element: IGenericTableRow;
	};
	removed?: {
		oldIndex: number;
		element: IGenericTableRow;
	};
	moved?: {
		oldIndex: number;
		newIndex: number;
		element: IGenericTableRow;
	};
}
