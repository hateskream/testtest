export enum Sentiment {
	Optimistic = 'optimistic',
	Neutral = 'neutral',
	Pessimistic = 'pessimistic',
}

export const sentimentToName: Readonly<Record<Sentiment, string>> = {
	[Sentiment.Optimistic]: 'Optimistic',
	[Sentiment.Neutral]: 'Neutral',
	[Sentiment.Pessimistic]: 'Pessimistic',
};

export enum Score {
	Low = 'low',
	Medium = 'medium',
	High ='high',
}

export const scoreToName: Readonly<Record<Score, string>> = {
	[Score.Low]: 'Low',
	[Score.Medium]: 'Medium',
	[Score.High]: 'High',
};

export enum Source {
	InvestingCom = 'investing.com',
	Benzinga = 'benzinga',
}

export const sourceToName: Readonly<Record<Source, string>> = {
	[Source.InvestingCom]: 'Investing.com',
	[Source.Benzinga]: 'Benzinga',
};

export function toggleFilter<T>(selected: Set<T>, value: T): Set<T> {
	const newSet = new Set(selected);
	newSet.has(value) ? newSet.delete(value) : newSet.add(value);
	return newSet;
}

export function titleGenerator<T extends string>(
	selectedSet: Set<T>,
	mappingObject: Record<T, string>,
): string {
	if (selectedSet.size === 0) {
		return '';
	}

	const firstElementName = mappingObject[Array.from(selectedSet)[0]];

	const otherSelectedCount = selectedSet.size - 1;

	if (otherSelectedCount === 0) {
		return firstElementName;
	}

	return `${firstElementName} +${otherSelectedCount}`;
}

export function compareFilter<T>(filter1: Set<T>, filter2: Set<T>): boolean {
	if (filter1.size !== filter2.size) {
		return false;
	}
	for (const item of filter1) {
		if (!filter2.has(item)) {
			return false;
		}
	}
	return true;
}

export function compareArray(a: string[], b: string[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	const set = new Set(a);
	for (const item of b) {
		if (!set.has(item)) {
			return false;
		}
	}
	return true;
}
