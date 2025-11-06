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
