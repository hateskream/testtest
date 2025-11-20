import { endOfDay } from 'date-fns';

export const RangeChart = {
	'24H': '24H',
	'1D': '1D',
	'7D': '7D',
	'1W': '1W',
	'1M': '1M',
	'3M': '3M',
	'6M': '6M',
	'1Y': '1Y',
	'3Y': '3Y',
	'5Y': '5Y',
	'10Y': '10Y',
	'YTD': 'YTD',
	'ALL': 'ALL',
} as const;

export type RangeChart = (typeof RangeChart)[keyof typeof RangeChart];

export interface IRangeChartOffset {
	days?: number;
	months?: number;
	years?: number;
}

const RangeOffsets: Record<RangeChart, IRangeChartOffset | 'YTD' | 'ALL'> = {
	[RangeChart['24H']]: { days: 1 },
	[RangeChart['1D']]: { days: 1 },
	[RangeChart['7D']]: { days: 7 },
	[RangeChart['1W']]: { days: 7 },
	[RangeChart['1M']]: { months: 1 },
	[RangeChart['3M']]: { months: 3 },
	[RangeChart['6M']]: { months: 6 },
	[RangeChart['1Y']]: { years: 1 },
	[RangeChart['3Y']]: { years: 3 },
	[RangeChart['5Y']]: { years: 5 },
	[RangeChart['10Y']]: { years: 10 },
	[RangeChart['YTD']]: 'YTD',
	[RangeChart['ALL']]: 'ALL',
};

export function getChartRangeOffset(range: RangeChart): { from: Date; to: Date } {
	const to = endOfDay(new Date());
	const offset = RangeOffsets[range];

	if (offset === 'ALL') {
		return { from: new Date(0), to };
	}

	if (offset === 'YTD') {
		return { from: new Date(to.getFullYear(), 0, 1), to };
	}

	const from = new Date(to);
	if (offset.days) {
		from.setDate(from.getDate() - offset.days);
	}
	if (offset.months) {
		from.setMonth(from.getMonth() - offset.months);
	}
	if (offset.years) {
		from.setFullYear(from.getFullYear() - offset.years);
	}

	return { from, to };
}
