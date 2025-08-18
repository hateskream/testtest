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
