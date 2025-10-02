export enum Sort {
	DateNewest = 'date:newest',
	DateOldest = 'date:oldest',
	SourcePolarity = 'sourcePolarity',
	Importance = 'importance',
}

export type SortValue = string | {
	value: string;
	additional: string;
};

export const sortToName: Readonly<Record<Sort, SortValue>> = {
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
