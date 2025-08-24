import { v4 as uuidv4 } from 'uuid';

import { createEmptyTable, type ITable } from './table';

export interface ITab {
	id: string;
	name: string;
	order: number;
	table: ITable;
}

export function createEmptyTab(name: string, order: number): ITab {
	return {
		id: uuidv4(),
		name,
		order,
		table: createEmptyTable(),
	};
}
