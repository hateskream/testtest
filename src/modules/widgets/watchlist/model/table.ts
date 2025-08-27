import { hydrateColumns, rehydrateColumns, type IHydratedColumn, type ISort, type ITableColumn } from '@/modules/cell';
import {
	addRow,
	getMockSectionsFirst,
	getMockSectionsSecond,
	isCustom,
	newCustomSection,
	type ISection,
} from './section';
import { getDefaultTickerState, type ITickerState } from './ticker-state';
import { ALL_COLUMNS } from './column';
import type { MarketType } from '@/modules/market';
import { createRow } from './row';

export interface ITable {
	columns: ITableColumn[];
	sections: ISection[];
	tickerState: ITickerState;
	sort: ISort | null;
}
export interface IHydratedTable {
	columns: IHydratedColumn[];
	sections: ISection[];
	tickerState: ITickerState;
	sort: ISort | null;
}

const MAX_COUNT_CUSTOM_SECTIONS = 5;

export function hydrateTable(table: ITable): IHydratedTable {
	return {
		...table,
		columns: hydrateColumns(table.columns),
	};
}

export function rehydrateTable(table: IHydratedTable): ITable {
	return {
		...table,
		columns: rehydrateColumns(table.columns, ALL_COLUMNS),
	};
}

export function getMockTableFirst(): ITable {
	return {
		columns: ALL_COLUMNS,
		sections: getMockSectionsFirst(),
		sort: null,
		tickerState: getDefaultTickerState(),
	};
}

export function getMockTableSecond(): ITable {
	return {
		columns: ALL_COLUMNS,
		sections: getMockSectionsSecond(),
		sort: null,
		tickerState: getDefaultTickerState(),
	};
}

export function createEmptyTable(): ITable {
	return {
		columns: ALL_COLUMNS,
		sections: [],
		sort: null,
		tickerState: getDefaultTickerState(),
	};
}

export function changeTickerState(table: ITable, tickerState: ITickerState): ITable {
	return {
		...table,
		tickerState,
	};
}

export function changeColumnsState(table: ITable, columns: ITableColumn[]): ITable {
	return {
		...table,
		columns,
	};
}

export function updateSort(table: ITable, sort: ISort | null): ITable {
	return {
		...table,
		sort,
	};
}

export function changeSectionsVisibility(table: ITable, sectionId: string, isOpen: boolean): ITable {
	return updateSection(table, sectionId, section => ({
		...section,
		isOpen,
	}));
}

export function renameSection(table: ITable, sectionId: string, newName: string): ITable {
	return updateSection(table, sectionId, section => ({
		...section,
		name: newName,
	}));
}

export function moveRowInSection(
	table: ITable,
	sectionId: string,
	oldIndex: number,
	newIndex: number,
): ITable {
	const sectionIdx = findSectionIndex(table, sectionId);
	if (sectionIdx === -1) {
		return table;
	}

	const section = table.sections[sectionIdx];
	const updatedRows = [...section.rows];

	if (
		oldIndex < 0 ||
		newIndex < 0 ||
		oldIndex >= updatedRows.length ||
		newIndex >= updatedRows.length
	) {
		return table;
	}

	const [moved] = updatedRows.splice(oldIndex, 1);
	updatedRows.splice(newIndex, 0, moved);

	return updateSection(
		table,
		sectionId,
		sec => ({
			...sec,
			rows: updatedRows,
		}),
	);
};

export function moveRowBetweenSections(
	table: ITable,
	fromSectionId: string,
	toSectionId: string,
	rowId: string,
	toIndex: number,
): ITable {
	const fromSectionIdx = findSectionIndex(table, fromSectionId);
	const toSectionIdx = findSectionIndex(table, toSectionId);
	if (fromSectionIdx === -1 || toSectionIdx === -1) {
		return table;
	}

	const fromSection = table.sections[fromSectionIdx];
	const toSection = table.sections[toSectionIdx];

	const fromRows = [...fromSection.rows];
	const toRows = [...toSection.rows];

	const rowIdx = fromRows.findIndex(m => m.id === rowId);
	if (rowIdx === -1) {
		return table;
	}

	const [moved] = fromRows.splice(rowIdx, 1);
	toRows.splice(toIndex, 0, moved);

	return {
		...table,
		sections: table.sections.map((s, idx) => {
			if (idx === fromSectionIdx) {
				return { ...s, rows: fromRows };
			}
			if (idx === toSectionIdx) {
				return { ...s, rows: toRows };
			}
			return s;
		}),
	};
};

export function deleteSection(table: ITable, sectionId: string): ITable {
	return {
		...table,
		sections: table.sections.filter(section => section.id !== sectionId),
	};
}

export function addCustomSection(table: ITable): ITable {
	if (
		getCountCustomSections(table) >= MAX_COUNT_CUSTOM_SECTIONS
	) {
		return table;
	}

	return {
		...table,
		sections: [
			...table.sections,
			newCustomSection(),
		],
	};
}

function getCountCustomSections(table: ITable): number {
	return table.sections.filter(section => isCustom(section)).length;
}

export function addTickerInTable(
	table: ITable,
	tickerId: string,
	_: MarketType,
): ITable {
	// если я забыл это исправить я пидарас
	return {
		...table,
		sections: [
			...table.sections,
			addRow(
				newCustomSection(),
				createRow(tickerId),
			),
		],
	};
}

function updateSection(
	table: ITable,
	sectionId: string,
	transform: (section: ISection) => ISection,
): ITable {
	return {
		...table,
		sections: table.sections
			.map(sec =>
				sec.id === sectionId
					? transform(sec)
					: sec,
			),
	};
}

function findSectionIndex(table: ITable, sectionId: string): number {
	return table.sections.findIndex(s => s.id === sectionId);
}
