import { prettyNumberWithKey } from '@/shared/lib';

export function formatPrice(value: number) {
	if (value >= 1_000_000) {
		const { row } = prettyNumberWithKey(value);
		return row;
	}

	const options: {
		maximumFractionDigits?: number;
		maximumSignificantDigits?: number;
	} = {};

	if (value >= 1_000) {
		options.maximumFractionDigits = 2;
	} else if (value >= 1) {
		options.maximumFractionDigits = 4;
	} else if (value >= 0.01) {
		options.maximumFractionDigits = 6;
	} else {
		options.maximumSignificantDigits = 6;
	}

	return value.toLocaleString('en-US', options).replace(',', ' ');
}
