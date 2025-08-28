import type { RangeChart } from './types';

export const RANGE_IN_SECONDS: { [x in RangeChart]: number } = {
	'1D': 86400,
	'1W': 604800,
	'1M': 2592000,
	'3M': 2592000 * 3,
	'6M': 2592000 * 6,
	'1Y': 31536000,
	'3Y': 31536000 * 3,
	'5Y': 31536000 * 5,
	'10Y': 31536000 * 10,
	YTD: -1,
	ALL: -1,
};
