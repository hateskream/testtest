import { prettyNumberWithKey } from '@/shared/lib';

export function formatPercent(value: number) {
	if (value >= 1_000_000) {
		const { row } = prettyNumberWithKey(value);
		return row;
	}

	const options: {
		maximumFractionDigits?: number;
		maximumSignificantDigits?: number;
	} = {};

	if (value >= 100) {
		options.maximumFractionDigits = 0;
	} else if (value >= 0.1) {
		options.maximumFractionDigits = 2;
	} else {
		options.maximumSignificantDigits = 3;
	}

	return value.toLocaleString('en-US', options).replace(',', ' ');
}
