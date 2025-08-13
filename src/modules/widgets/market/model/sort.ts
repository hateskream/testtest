import type { ColumnType } from '@/modules/cell';

enum SortDirection {
	ASC = 'asc',
	DESC = 'desc',
	NONE= 'none',
};

type TransitionRules = {
	[currentState in SortDirection]: SortDirection;
};

const transitionRules: TransitionRules = {
	[SortDirection.NONE]: SortDirection.ASC,
	[SortDirection.ASC]: SortDirection.DESC,
	[SortDirection.DESC]: SortDirection.NONE,
};

export function nextSortState(currentState: SortDirection): SortDirection {
	return transitionRules[currentState];
}

export interface ISort {
	columnType: ColumnType;
	sortDirection: SortDirection;
}
