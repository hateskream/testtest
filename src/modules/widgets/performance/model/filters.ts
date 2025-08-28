export enum Stock {
	Industry = 'Industry',
	Sector = 'Sector',
}

export const stockToLabel: Readonly<Record<Stock, string>> = {
	[Stock.Industry]: 'Industry',
	[Stock.Sector]: 'Sector',
};

export enum DateRange {
	Today = 'Today',
	Yesterday = 'Yesterday',
	Week = 'Week',
}

export const dateToLabel: Readonly<Record<DateRange, string>> = {
	[DateRange.Today]: 'Today',
	[DateRange.Yesterday]: 'Yesterday',
	[DateRange.Week]: 'Week',
};
