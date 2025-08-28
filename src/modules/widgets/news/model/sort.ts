export enum Sort {
	Date = 'date',
	SourcePolarity = 'sourcePolarity',
	Importance = 'importance',
}

export const sortToName: Readonly<Record<Sort, string>> = {
	[Sort.Date]: 'Date',
	[Sort.SourcePolarity]: 'Source polarity',
	[Sort.Importance]: 'Importance',
};

export type SortState = Sort | null;

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
