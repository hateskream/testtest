// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { ref } from 'vue';

import type { IDragEvent, IGenericTableColumn, IGenericTableRow, SortDirection } from '../type';
import { TableColumnType } from '../type';

// Shared data functions
export function useTableData() {
	const compareValues = (a: unknown, b: unknown, type: TableColumnType): number => {
		if (a == null && b == null) {
			return 0;
		}
		if (a == null) {
			return -1;
		}
		if (b == null) {
			return 1;
		}

		switch (type) {
			case TableColumnType.DATE: {
				const dateA = new Date(a as string | number | Date).getTime();
				const dateB = new Date(b as string | number | Date).getTime();
				return dateA - dateB;
			}
			case TableColumnType.STRING:
			case TableColumnType.IMAGE_STRING:
				return String(a).localeCompare(String(b));
			case TableColumnType.NUMBER:
			case TableColumnType.PERCENT: {
				const numA = Number(a);
				const numB = Number(b);
				if (isNaN(numA) && isNaN(numB)) {
					return 0;
				}
				if (isNaN(numA)) {
					return -1;
				}
				if (isNaN(numB)) {
					return 1;
				}
				return numA - numB;
			}
			default:
				return String(a).localeCompare(String(b));
		}
	};

	const sortData = (
		data: IGenericTableRow[],
		column: IGenericTableColumn,
		direction: SortDirection,
	): IGenericTableRow[] => {
		if (direction === 'none' || !column.sortable) {
			return data;
		}

		const sorted = [...data].sort((a, b) => {
			// Access sortValue from the cell wrapper structure
			const aVal = a.data[column.key]?.sortValue;
			const bVal = b.data[column.key]?.sortValue;

			const result = compareValues(aVal, bVal, column.type);
			return direction === 'desc' ? -result : result;
		});

		return sorted;
	};

	return {
		sortData,
		compareValues,
	};
}

// Shared drag & drop functions
export function useTableDragDrop() {
	const dndBuffer = ref<Record<string, IGenericTableRow>>({});

	const handleDragChange = (
		dragEvent: IDragEvent,
		currentSectionId: string,
		onMoved?: (sectionId: string, oldIndex: number, newIndex: number) => void,
		onTransfer?: (event: IDragEvent, sectionId: string) => void,
	) => {
		if (dragEvent.moved && onMoved) {
			onMoved(currentSectionId, dragEvent.moved.oldIndex, dragEvent.moved.newIndex);
		} else if ((dragEvent.added || dragEvent.removed) && onTransfer) {
			onTransfer(dragEvent, currentSectionId);
		}
	};

	return {
		dndBuffer,
		handleDragChange,
	};
}

// Shared column functions
export function useTableColumns() {
	const groupColumnsByCategory = (columns: IGenericTableColumn[]) => {
		const grouped: Record<string, IGenericTableColumn[]> = {};

		columns.forEach(column => {
			const groupName = column.group?.displayName || column.group?.name || 'General';
			if (!grouped[groupName]) {
				grouped[groupName] = [];
			}
			grouped[groupName].push(column);
		});

		return grouped;
	};

	const updateColumnPositions = (columns: IGenericTableColumn[]): IGenericTableColumn[] => {
		return columns.map((column, index) => ({
			...column,
			position: index,
		}));
	};

	const toggleColumnVisibility = (
		columns: IGenericTableColumn[],
		columnKey: string,
	): IGenericTableColumn[] => {
		return columns.map(column =>
			column.key === columnKey
				? { ...column, visible: !column.visible }
				: column,
		);
	};

	return {
		groupColumnsByCategory,
		updateColumnPositions,
		toggleColumnVisibility,
	};
}

// Shared table functions
export function useTableLayout() {
	const getColumnStyles = (columns: IGenericTableColumn[]): Record<string, string> => {
		const styles: Record<string, string> = {};

		columns.forEach((col, index) => {
			let width = '';
			if (col.width !== undefined && col.width !== null) {
				width = `${col.width}px`;
			} else if (col.minWidth !== undefined && col.minWidth !== null) {
				width = `${col.minWidth}px`;
			} else {
				width = '150px';
			}

			styles[`--col-${index}-width`] = width;


			let minWidth = '';
			if (col.minWidth !== undefined && col.minWidth !== null) {
				minWidth = `${col.minWidth}px`;
			} else if (col.width !== undefined && col.width !== null) {
				minWidth = `${col.width}px`;
			} else {
				minWidth = '150px';
			}

			styles[`--col-${index}-min-width`] = minWidth;


		});
		return styles;
	};


	const getDataColumnSpan = (visibleColumnsCount: number): number => {
		return visibleColumnsCount;
	};

	return {
		getColumnStyles,
		getDataColumnSpan,
	};
}
