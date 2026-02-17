const cache = new Map<string, string>();

function getCssVarImpl(name: string, fallback: string): string {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	return value || fallback;
}

export function getCssVar(name: string, fallback: string): string {
	const cached = cache.get(name);
	if (cached !== undefined) {
		return cached;
	}
	const value = getCssVarImpl(name, fallback);
	cache.set(name, value);
	return value;
}
