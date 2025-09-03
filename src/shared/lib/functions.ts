export function updateById<T extends { id: string }>(
	state: T[],
	id: string,
	transform: (s: T) => T,
): T[] {
	return state.map(s => s.id === id ? transform(s) : s);
}
