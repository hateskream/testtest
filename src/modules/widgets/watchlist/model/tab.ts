import { v4 as uuidv4 } from 'uuid';

import { createEmptyTable, hydrateTable, rehydrateTable, type IHydratedTable, type ITable } from './table';

export interface ITab {
	id: string;
	name: string;
	order: number;
	table: ITable;
}

export interface IHydratedTab {
	id: string;
	name: string;
	order: number;
	table: IHydratedTable;
}

export interface ITabUi {
	id: string;
	name: string;
	isActive: boolean;
	order: number;
}

export enum TabAction {
	Rename = 'rename',
	Share = 'share',
	Duplicate = 'duplicate',
	AddAlert = 'addAlert',
	AddSymbolsToList = 'addSymbolsToList',
}

export const tabActionToTitle: Readonly<Record<TabAction, string>> = {
	[TabAction.Rename]: 'Rename',
	[TabAction.Share]: 'Share',
	[TabAction.Duplicate]: 'Duplicate',
	[TabAction.AddAlert]: 'Add alert',
	[TabAction.AddSymbolsToList]: 'Add symbols to list',
};

export function hydrateTab(tab: ITab): IHydratedTab {
	return {
		...tab,
		table: hydrateTable(tab.table),
	};
}

export function rehydrateTab(tab: IHydratedTab): ITab {
	return {
		...tab,
		table: rehydrateTable(tab.table),
	};
}

export function duplicate(tab: ITab): ITab {
	return {
		...tab,
		id: uuidv4(),
	};
}

export function createMockTab(name: string, order: number, table: ITable): ITab {
	return {
		id: uuidv4(),
		name,
		order,
		table,
	};
}

export function createEmptyTab(name: string, order: number): ITab {
	return {
		id: uuidv4(),
		name,
		order,
		table: createEmptyTable(),
	};
}

export function updateTable(tab: ITab, table: ITable): ITab {
	return {
		...tab,
		table,
	};
}
