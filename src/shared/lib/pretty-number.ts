export interface IPrettyNumberPayload {
	value: string;
	suffix: string;
	row: string;
}

const cache = new Map<number, Intl.NumberFormat>();

function createFormatter(precision: number) {
	if (cache.has(precision)) {
		return cache.get(precision)!;
	}

	const formatter = new Intl.NumberFormat('en', {
		notation: 'compact',
		compactDisplay: 'short',
		maximumFractionDigits: precision,
	});

	cache.set(precision, formatter);

	return formatter;
}

function toNumber(value: number | string) {
	if (typeof value === 'string') {
		return Number(value);
	}

	return value;
}

export function prettyNumberWithKey(value: number | string, precision: number = 1): IPrettyNumberPayload {
	const formatter = createFormatter(precision);
	const num = toNumber(value);

	if (num >= 1000) {
		const parts = formatter.formatToParts(num);

		const suffix = parts.find(part => part.type === 'compact')?.value ?? '';
		const formatted = parts.reduce((fmt, part) => {
			if (part.type === 'compact') {
				return fmt;
			}

			return fmt + part.value;
		}, '');

		return {
			value: formatted,
			row: `${formatted}${suffix}`,
			suffix,
		};
	}

	const str = num.toFixed(precision);

	return {
		value: str,
		row: str,
		suffix: '',
	};
}
