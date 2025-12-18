import { Currency } from '@/modules/widgets/performance/model/quote-currency.ts';

export enum Stock {
	Industry = 'Industry',
	Sector = 'Sector',
}

export const stockToLabel: Readonly<Record<Stock, string>> = {
	[Stock.Industry]: 'Industry',
	[Stock.Sector]: 'Sector',
};

export const stockFilters = Object.values(Stock).map(s => ({
	label: stockToLabel[s],
	value: s,
}));

export enum DateRangeStock {
	Today = 'Today',
	Yesterday = 'Yesterday',
	Week = 'Week',
}

export enum DateRangeForex {
	Day = '1d',
	FiveDays = '5d',
	Month = '1m',
	SixMonths = '6m',
	Year = '1y',
	FiveYears = '5y',
	All = 'All',
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
	[DateRangeForex.Month]: '1M',
	[DateRangeForex.FiveDays]: '5D',
	[DateRangeForex.SixMonths]: '6M',
	[DateRangeForex.Year]: '1Y',
	[DateRangeForex.FiveYears]: '5Y',
	[DateRangeForex.All]: 'All',
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

export const quoteCurrencyFilters = Object.values(Currency).map(c => ({
	label: c,
	value: c,
}));
