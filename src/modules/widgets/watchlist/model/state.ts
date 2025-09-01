import type { MarketType } from '@/modules/market';
import {
	createEmptyTab,
	// createInitialTabWithMockData,
	duplicate,
	hydrateTab,
	rehydrateTab,
	updateTable,
	type IHydratedTab,
	type ITab,
	type ITabUi,
} from './tab';
import { addTickerInTable, deleteTickerInTable, type ITable } from './table';

export interface IState {
	activeTabId: string | null;
	tabs: ITab[];
}

export interface IHydratedState {
	activeTabId: string | null;
	tabs: IHydratedTab[];
}

export interface IPublicState {
	watchlistId: string;
	tabId: string;
	name: string;
	tickers: string[];
}

const MAX_TAB_COUNT = 10;

export function getPublicState(state: IState, watchlistId: string): IPublicState[] {
	return state.tabs.map(t => ({
		watchlistId,
		tabId: t.id,
		name: t.name,
		tickers: t.table.sections
			.map(s => s.rows
				.map(r => r.id))
			.flatMap(r => r),
	}));
}

export function hydrateState(state: IState): IHydratedState {
	return {
		...state,
		tabs: state.tabs.map(t => hydrateTab(t)),
	};
}

export function rehydrateState(state: IHydratedState): IState {
	return {
		...state,
		tabs: state.tabs.map(t => rehydrateTab(t)),
	};
}

export function getDefaultState(): IState {
	const tab = createEmptyTab(0);
	// const tab = createInitialTabWithMockData(0);

	return {
		activeTabId: tab.id,
		tabs: [tab],
	};
}

export function changeActiveTab(state: IState, newActiveTabId: string): IState {
	return {
		...state,
		activeTabId: newActiveTabId,
	};
}

export function addNewTab(state: IState): IState {
	if (state.tabs.length >= MAX_TAB_COUNT) {
		return state;
	}

	const newTab = createEmptyTab(
		getLastTabOrder(state) + 1,
	);

	return {
		...state,
		activeTabId: newTab.id,
		tabs: [...state.tabs, newTab],
	};
}

export function duplicateTab(state: IState, tabId: string): IState {
	const tab = findTab(state, tabId);
	if (tab === undefined) {
		return state;
	}

	const newTab = duplicate(tab);

	const currentIndex = state.tabs.findIndex((t) => t.id === tabId);

	return {
		...state,
		activeTabId: newTab.id,
		tabs: reorderTabs(
			[
				...state.tabs.slice(0, currentIndex + 1),
				newTab,
				...state.tabs.slice(currentIndex + 1),
			],
		),
	};
}

export function removeTab(state: IState, tabId: string): IState {
	const tabIndex = state.tabs.findIndex((t) => t.id === tabId);
	if (tabIndex === -1) {
		return state;
	}

	let newActiveTabId = state.activeTabId;
	if (state.activeTabId === tabId) {
		if (tabIndex > 0) {
			newActiveTabId = state.tabs[tabIndex - 1].id;
		} else {
			newActiveTabId = state.tabs[tabIndex + 1].id;
		}
	}

	const newTabs = state.tabs.filter((t) => t.id !== tabId);

	return {
		...state,
		activeTabId: newActiveTabId,
		tabs: reorderTabs(newTabs),
	};
}

export function changeTabOrder(state: IState, tabIds: string[]): IState {
	if (
		!allTabsPresent(
			tabIds,
			state.tabs
				.map(t => t.id),
		)
	) {
		return state;
	}

	return {
		...state,
		tabs: tabIds
			.map((id, order) => ({
				...findTab(state, id)!,
				order,
			})),
	};
}

export function renameTab(state: IState, tabId: string, newName: string): IState {
	return updateTab(
		state,
		tabId,
		tab => ({
			...tab,
			name: newName,
		}),
	);
}

export function updateActiveTab(state: IState, tab: ITab): IState {
	if (state.activeTabId === null) {
		return state;
	}

	return updateTab(
		state,
		state.activeTabId,
		() => ({
			...tab,
		}),
	);
}

export function getActiveTab(state: IState): ITab | null {
	if (state.activeTabId === null) {
		return null;
	}

	return findTab(state, state.activeTabId) ?? null;
}

export function updateTableState(
	state: IState,
	table: ITable | null,
	activeTab: ITab | null,
	updateFn: (t: ITable) => ITable,
): IState {
	if (activeTab === null || table === null) {
		return state;
	}

	return updateActiveTab(
		state,
		updateTable(
			activeTab,
			updateFn(table),
		),
	);
}

export function getUiTabs(state: IState): ITabUi[] {
	if (state.activeTabId === null) {
		return [];
	}

	return state.tabs
		.map(t => ({
			...t,
			isActive: t.id === state.activeTabId,
		}))
		.sort((a, b) => a.order - b.order);
}

export function addTickerInTab(
	state: IState,
	tickerId: string,
	tickerType: MarketType,
	tabId: string,
): IState {
	return updateTab(
		state,
		tabId,
		tab => ({
			...tab,
			table: addTickerInTable(tab.table, tickerId, tickerType),
		}),
	);
}

export function deleteTickerInTab(
	state: IState,
	tickerId: string,
	tickerType: MarketType,
	tabId: string,
): IState {
	return updateTab(
		state,
		tabId,
		tab => ({
			...tab,
			table: deleteTickerInTable(tab.table, tickerId, tickerType),
		}),
	);
}

function updateTab(
	state: IState,
	tabId: string,
	transform: (section: ITab) => ITab,
): IState {
	return {
		...state,
		tabs: state.tabs
			.map(tab =>
				tab.id === tabId
					? transform(tab)
					: tab,
			),
	};
}

function allTabsPresent(tabIds1: string[], tabIds2: string[]): boolean {
	const set = new Set(tabIds2);
	for (const element of tabIds1) {
		if (!set.has(element)) {
			return false;
		}
	}
	return true;
}

function getLastTabOrder({ tabs }: IState): number {
	if (tabs.length === 0) {
		return 0;
	}

	return [...tabs]
		.sort((a, b) => b.order - a.order)[0]
		.order;
}

function reorderTabs(tabs: ITab[]): ITab[] {
	return tabs.map((t, i) => ({ ...t, order: i }));
}

export function findTab(state: IState, tabId: string): ITab | undefined {
	return state.tabs.find(t => t.id === tabId);
}
