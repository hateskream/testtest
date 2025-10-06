const cacheMap = new Map<string, unknown>();

export function useFetchMock<T>(url: string) {
	async function getMock(): Promise<T> {
		if (cacheMap.get(url)) {
			return cacheMap.get(url) as T;
		}

		const data = await load();
		cacheMap.set(url, data);

		return data;
	}

	async function load(): Promise<T> {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error('Failed to load');
		}
		return res.json();
	}

	return {
		getMock,
	};
}
