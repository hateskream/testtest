import { ref } from 'vue';

import type {
	IGenericTableColumn,
	IGenericTableRow,
	SortDirection,
	IDragEvent,
} from '../type';

export function useTableData<T = Record<string, unknown>>() {
	const compareValues = (a: unknown, b: unknown, type: string): number => {
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
			case 'date':
				return new Date(a as string | number | Date).getTime() - new Date(b as string | number | Date).getTime();
			case 'string':
			case 'image-string':
				return String(a).localeCompare(String(b));
			case 'number':
			case 'percent':
			{ const numA = Number(a);
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
				return numA - numB; }
			default:
				return String(a).localeCompare(String(b));
		}
	};

	const sortData = (
		data: IGenericTableRow<T>[],
		column: IGenericTableColumn,
		direction: SortDirection,
	): IGenericTableRow<T>[] => {
		if (direction === 'none' || !column.sortable) {
			return data;
		}

		const sorted = [...data].sort((a, b) => {
			let aVal = a.data[column.key];
			let bVal = b.data[column.key];

			// Handle company object case
			if (column.key === 'company' && aVal && typeof aVal === 'object') {
				const objA = aVal as Record<string, unknown>;
				aVal = objA.company_name || objA.name || String(aVal);
			}
			if (column.key === 'company' && bVal && typeof bVal === 'object') {
				const objB = bVal as Record<string, unknown>;
				bVal = objB.company_name || objB.name || String(bVal);
			}

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

export function useTableDragDrop<T = Record<string, unknown>>() {
	const dndBuffer = ref<Record<string, IGenericTableRow<T>>>({});

	const handleDragChange = (
		evt: IDragEvent,
		sectionId: string,
		onMoved?: (sectionId: string, oldIndex: number, newIndex: number) => void,
		onTransfer?: (evt: IDragEvent, sectionId: string) => void,
	) => {
		if (evt.moved && onMoved) {
			onMoved(sectionId, evt.moved.oldIndex, evt.moved.newIndex);
		} else if ((evt.added || evt.removed) && onTransfer) {
			onTransfer(evt, sectionId);
		}
	};

	return {
		dndBuffer,
		handleDragChange,
	};
}

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
