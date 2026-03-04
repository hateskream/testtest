import { type IncludeType } from './filters';

export const Sort = {
	DateNewest: 'date:newest',
	DateOldest: 'date:oldest',
	SourcePolarity: 'sourcePolarity',
	Importance: 'importance',
} as const;

export type SortType = (typeof Sort)[keyof typeof Sort];

export type SortValue = string | {
	value: string;
	additional: string;
};

export const sortToName: Readonly<Record<SortType, SortValue>> = {
	[Sort.DateNewest]: {
		value: 'Date',
		additional: 'Newest first',
	},
	[Sort.DateOldest]: {
		value: 'Date',
		additional: 'Oldest first',
	},
	[Sort.SourcePolarity]: 'Source polarity',
	[Sort.Importance]: 'Importance',
};

export type SortState = SortType | null;

export function toggleSort(prevSort: SortState, newSort: SortState): SortState {
	return prevSort === newSort ? null : newSort;
}

export function compareSort(sort1: SortState, sort2: SortState): boolean {
	if (sort1 === null && sort2 === null) {
		return true;
	}
	if (sort1 === null || sort2 === null) {
		return false;
	}
	return sort1 === sort2;
}

export function compareInclude(include1: IncludeType, include2: IncludeType) {
	return include1 === include2;
}
