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

export function getSortName(sort: Sort) {
	return sortToName[sort];
}
