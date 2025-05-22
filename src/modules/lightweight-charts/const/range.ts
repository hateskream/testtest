import type { RangeChart } from '../model';

export const RANGE_IN_SECONDS: { [x in RangeChart]: number } = {
	'1D': 86400,
	'1W': 604800,
	'1M': 2592000,
	'6M': 15552000,
	'1Y': 31536000,
	ALL: -1,
};
