import { updateById } from '@/shared/lib';
import {
	hydrateTable,
	rehydrateTable,
	type IHydratedTable,
	type ITable,
} from './table';
import type { IWatchlist } from '@/modules/watchlist';
import { fromWatchlistToUiSections, type ISectionUi } from './section';

export interface IState {
	activeTableId: string | null;
	tables: ITable[];
}

export interface IHydratedState {
	activeTableId: string | null;
	tables: IHydratedTable[];
}

export function hydrateState(state: IState): IHydratedState {
	return {
		...state,
		tables: state.tables.map(t => hydrateTable(t)),
	};
}

export function rehydrateState(state: IHydratedState): IState {
	return {
		...state,
		tables: state.tables.map(t => rehydrateTable(t)),
	};
}

export function getDefaultState(): IState {
	return {
		activeTableId: null,
		tables: [],
	};
}

export function selectNewActiveTableId(
	watchlistsNew: IWatchlist[],
	watchlistsOld: IWatchlist[],
	currentTableId: string | null,
): string | null {
	if (watchlistsNew.length > watchlistsOld.length) {
		return watchlistsNew[watchlistsNew.length - 1].id;
	}

	if (watchlistsNew.length < watchlistsOld.length) {
		const deletedId = watchlistsOld.find(oldItem => !watchlistsNew.some(newItem => newItem.id === oldItem.id))?.id;

		if (deletedId === currentTableId) {
			const currentIndex = watchlistsOld.findIndex(item => item.id === deletedId);

			if (currentIndex < watchlistsOld.length - 1) {
				return watchlistsOld[currentIndex + 1].id;
			}

			if (currentIndex > 0) {
				return watchlistsOld[currentIndex - 1].id;
			}

			return null;
		}
	}

	if (currentTableId === null && watchlistsOld.length === 0 && watchlistsNew.length > 0) {
		return watchlistsNew[0].id;
	}

	return currentTableId;
}

export function changeActiveTable(state: IState, newActiveTableId: string): IState {
	return {
		...state,
		activeTableId: newActiveTableId,
	};
}

export function getActiveTab(state: IState): ITable | null {
	if (state.activeTableId === null) {
		return null;
	}

	return findTable(state, state.activeTableId) || null;
}

export function updateTableState(
	state: IState,
	updateFn: (t: ITable) => ITable,
): IState {
	if (state.activeTableId === null) {
		return state;
	}

	return {
		...state,
		tables: updateById(state.tables, state.activeTableId, updateFn),
	};
}

export function getSections(state: IState, watchlists: IWatchlist[]): ISectionUi[] {
	if (state.activeTableId === null) {
		return [];
	}

	return fromWatchlistToUiSections(
		watchlists
			.find(w => w.id === state.activeTableId)?.sections || [],
	);
}

export function findTable(state: IState, tableId: string): ITable | null {
	return state.tables.find(t => t.id === tableId) || null;
}
