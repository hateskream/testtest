import { MarketIds, markets as marketsData } from '@/modules/calendar';

export function toggleSet<T>(target: Set<T>, value: T): Set<T> {
	const newSet = new Set(target);

	if (newSet.has(value)) {
		newSet.delete(value);
	} else {
		newSet.add(value);
	}

	return newSet;
}

export function isAllSelected<T>(target: Set<T>, allValues: T[]) {
	return target.size === allValues.length;
}

export function toggleAllSelect<T>(target: Set<T>, allValues: T[]) {
	return isAllSelected(target, allValues)
		? new Set<T>()
		: new Set<T>(allValues);
}

export function formattedLabel<T>(
	arr: T[],
	allValues: T[],
	allLabel: string,
	emptyLabel: string,
): string {
	if (arr.length === 0) {
		return emptyLabel;
	}

	if (arr.length === allValues.length) {
		return allLabel;
	}

	if (arr.length === 1) {
		return String(arr[0]);
	}

	return `${arr[0]} +${arr.length - 1}`;
}

export function getMarketLabel(id: MarketIds) {
	return marketsData.find(v => v.id === id)?.label;
}
