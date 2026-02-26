export function cacheStringFunction<T extends string, R>(fn: (arg: T) => R): (arg: T) => R {
	const cache: Record<T, R> = Object.create(null);

	return ((str: T) => {
		if (str in cache) {
			return cache[str];
		}

		return (cache[str] = fn(str));
	});
}
