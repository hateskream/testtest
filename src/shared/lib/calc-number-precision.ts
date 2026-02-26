export function calcNumberPrecision(value: number, min = 1, max = 8): number {
	if (value === 0) {
		return max;
	}

	const order = Math.floor(Math.log10(Math.abs(value)));
	const precision = Math.max(0, -order) + 2;

	return Math.min(Math.max(precision, min), max);
}
