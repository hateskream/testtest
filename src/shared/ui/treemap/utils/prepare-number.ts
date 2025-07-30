const THOUSAND = 1_000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const TRILLION = 1_000_000_000_000;

export function prepareNumber(value: number): string {
	if (value >= TRILLION) {
		return `${(value / TRILLION).toFixed(2)} T`;
	}

	if (value >= BILLION) {
		return `${(value / BILLION).toFixed(2)} B`;
	}

	if (value >= MILLION) {
		return `${(value / MILLION).toFixed(2)} M`;
	}

	if (value >= THOUSAND) {
		return `${(value / THOUSAND).toFixed(2)} K`;
	}

	return value.toFixed(2);
}

export function preparePercent(value: number): string {
	let sign = '';

	if (value > 0) {
		sign = '+';
	}

	return `${sign} ${value.toFixed(2)}%`;
}
