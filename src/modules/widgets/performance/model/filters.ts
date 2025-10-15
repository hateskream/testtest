export enum Stock {
	Industry = 'Industry',
	Sector = 'Sector',
}

export const stockToLabel: Readonly<Record<Stock, string>> = {
	[Stock.Industry]: 'Industry',
	[Stock.Sector]: 'Sector',
};

export enum DateRangeStock {
	Today = 'Today',
	Yesterday = 'Yesterday',
	Week = 'Week',
}

export enum DateRangeForex {
	Day = '1D',
	Week = '1W',
	Month = '1M',
	ThreeMonths = '3M',
	SixMonths = '6M',
	Year = '1Y',
}

export type DateRange = DateRangeStock | DateRangeForex;

export function isDataRangeStock(value: string): value is DateRangeStock {
	return Object.values(DateRangeStock).includes(value as DateRangeStock);
}

export const dateToLabel: Readonly<Record<DateRangeStock | DateRangeForex, string>> = {
	[DateRangeStock.Today]: 'Today',
	[DateRangeStock.Yesterday]: 'Yesterday',
	[DateRangeStock.Week]: 'Week',
	[DateRangeForex.Day]: '1D',
	[DateRangeForex.Week]: '1W',
	[DateRangeForex.Month]: '1M',
	[DateRangeForex.ThreeMonths]: '3M',
	[DateRangeForex.SixMonths]: '6M',
	[DateRangeForex.Year]: '1Y',
};

export function getDateLabelByType(isStock: boolean):
Record<DateRangeStock, string> | Record<DateRangeForex, string> {
	return Object
		.fromEntries(
			Object
				.entries(dateToLabel)
				.filter(([k]) => {
					const res = isDataRangeStock(k);
					return isStock ? res : !res;
				})
				.filter(Boolean),
		) as Record<DateRangeStock, string> | Record<DateRangeForex, string>;
}
