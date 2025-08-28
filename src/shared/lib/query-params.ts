const separator = ',';

export function arrayToString(arr: unknown[]) {
	return arr.join(separator);
}

export function stringToArray(str: string) {
	if (!str) {
		return [];
	}

	if (!str.includes(separator)) {
		return [str];
	}

	return str.split(separator);
}
