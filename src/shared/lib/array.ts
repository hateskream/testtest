export function isEmptyArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length === 0;
}

export function isNonEmptyArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length > 0;
}

export function createRange(from: number, to: number) {
	if (to > from) {
		return Array.from({ length: to - from + 1 }, (_, i) => from + i);
	}

	return Array.from({ length: from - to + 1 }, (_, i) => from - i);
}
