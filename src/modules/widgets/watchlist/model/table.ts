import { hydrateColumns, rehydrateColumns, type IHydratedColumn, type ISort, type ITableColumn } from '@/modules/cell';
import { type ISection as ISectionWatchlist, type IWatchlist } from '@/modules/watchlist';
import type { ISection } from './section';
import { getDefaultTickerState, type ITickerState } from './ticker-state';
import { ALL_COLUMNS } from './column';

export interface ITable {
	id: string;
	columns: ITableColumn[];
	sections: ISection[];
	tickerState: ITickerState;
	sort: ISort | null;
}
export interface IHydratedTable {
	id: string;
	columns: IHydratedColumn[];
	sections: ISection[];
	tickerState: ITickerState;
	sort: ISort | null;
}

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

export function createTable(id: string): ITable {
	return {
		id,
		columns: ALL_COLUMNS,
		sections: [],
		sort: null,
		tickerState: getDefaultTickerState(),
	};
}

export function createTablesFromWatchlists( watchlists: IWatchlist[], tables: ITable[]) {
	return watchlists
		.map(({ sections, id }, i) => {
			const table = tables[i];
			if (table) {
				return createTableFromWatchlistSections(id, sections, tables[i]);
			}

			return createTable(id);
		});
}

function createTableFromWatchlistSections(
	id: string,
	sectionsWatchlist: ISectionWatchlist[],
	{
		sections,
		columns,
		sort,
		tickerState,
	}: ITable,
): ITable {
	return {
		id,
		columns,
		sections: sectionsWatchlist.map((section, idx) => ({
			...section,
			isOpen: sections[idx].isOpen,
		})),
		sort,
		tickerState,
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
	return {
		...table,
		sections: table.sections.map(section => ({
			...section,
			isOpen: section.id === sectionId ? isOpen : section.isOpen,
		})),
	};
}
