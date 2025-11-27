export function isEmptyArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length === 0;
}

export function isNonEmptyArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length > 0;
}

