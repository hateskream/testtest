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

export const dateToShortLabel: Readonly<Record<DateRangeStock | DateRangeForex, string>> = {
	[DateRangeStock.Today]: 'Today',
	[DateRangeStock.Yesterday]: 'Yesterday',
	[DateRangeStock.Week]: 'Week',

	[DateRangeForex.Day]: '1D',
	[DateRangeForex.FiveDays]: '5D',
	[DateRangeForex.Month]: '1M',
	[DateRangeForex.SixMonths]: '6M',
	[DateRangeForex.Year]: '1Y',
	[DateRangeForex.FiveYears]: '5Y',
	[DateRangeForex.All]: 'All',
};

export const dateToFullLabel: Readonly<Record<DateRangeStock | DateRangeForex, string>> = {
	[DateRangeStock.Today]: 'Today',
	[DateRangeStock.Yesterday]: 'Yesterday',
	[DateRangeStock.Week]: 'Week',

	[DateRangeForex.Day]: '1 day',
	[DateRangeForex.FiveDays]: '5 days',
	[DateRangeForex.Month]: '1 month',
	[DateRangeForex.SixMonths]: '6 months',
	[DateRangeForex.Year]: '1 year',
	[DateRangeForex.FiveYears]: '5 years',
	[DateRangeForex.All]: 'All time',
};

export function getDateLabelByType(
	isStock: boolean,
	type: 'short' | 'full',
): Record<DateRangeStock, string> | Record<DateRangeForex, string> {
	const source = type === 'short'
		? dateToShortLabel
		: dateToFullLabel;

	return Object.fromEntries(
		Object.entries(source).filter(([key]) => {
			const isStockRange = isDataRangeStock(key);
			return isStock ? isStockRange : !isStockRange;
		}),
	) as Record<DateRangeStock, string> | Record<DateRangeForex, string>;
}

export const quoteCurrencyFilters = Object.values(Currency).map(c => ({
	label: c,
	value: c,
}));
