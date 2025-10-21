export function deepCompare(a: unknown, b: unknown, visited = new WeakMap<object, object>()): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (a == null || b == null) {
		return false;
	}
	if (typeof a !== 'object' || typeof b !== 'object') {
		return false;
	}

	if (visited.get(a as object) === b) {
		return true;
	}
	visited.set(a as object, b as object);

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i+=1) {
			if (!deepCompare(a[i], b[i], visited)) {
				return false;
			}
		}
		return true;
	}

	if (a instanceof Set && b instanceof Set) {
		if (a.size !== b.size) {
			return false;
		}
		for (const v of a) {
			let has = false;
			for (const v2 of b) {
				if (deepCompare(v, v2, visited)) {
					has = true;
					break;
				}
			}
			if (!has) {
				return false;
			}
		}
		return true;
	}

	if (a instanceof Map && b instanceof Map) {
		if (a.size !== b.size) {
			return false;
		}
		for (const [key, val] of a) {
			if (!b.has(key)) {
				return false;
			}
			if (!deepCompare(val, b.get(key), visited)) {
				return false;
			}
		}
		return true;
	}

	const keysA = Object.keys(a as object);
	const keysB = Object.keys(b as object);
	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if (!Object.prototype.hasOwnProperty.call(b, key)) {
			return false;
		}
		const valA = (a as Record<string, unknown>)[key];
		const valB = (b as Record<string, unknown>)[key];
		if (!deepCompare(valA, valB, visited)) {
			return false;
		}
	}

	return true;
}
