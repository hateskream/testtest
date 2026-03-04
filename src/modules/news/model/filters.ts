export const Sentiment = {
	Optimistic: 'Optimistic',
	Neutral: 'Neutral',
	Pessimistic: 'Pessimistic',
} as const;

export type SentimentType = (typeof Sentiment)[keyof typeof Sentiment];

export const sentimentToName: Readonly<Record<SentimentType, string>> = {
	[Sentiment.Optimistic]: 'Optimistic',
	[Sentiment.Neutral]: 'Neutral',
	[Sentiment.Pessimistic]: 'Pessimistic',
};

export const Score = {
	Low: 'low',
	Medium: 'medium',
	High: 'high',
} as const;

export type ScoreType = (typeof Score)[keyof typeof Score];

export const scoreToName: Readonly<Record<ScoreType, string>> = {
	[Score.Low]: 'Low',
	[Score.Medium]: 'Medium',
	[Score.High]: 'High',
};

export const Source = {
	InvestingCom: 'https://investing.com',
	Benzinga: 'https://benzinga.com',
} as const;

export type SourceType = (typeof Source)[keyof typeof Source];

export const sourceToName: Readonly<Record<SourceType, string>> = {
	[Source.InvestingCom]: 'Investing.com',
	[Source.Benzinga]: 'Benzinga',
};

export const Include = {
	GeneralNews: 'GeneralNews',
	PressReleases: 'PressReleases',
} as const;

export type IncludeType = (typeof Include)[keyof typeof Include];

export const includeToName: Readonly<Record<IncludeType, string>> = {
	[Include.GeneralNews]: 'General News',
	[Include.PressReleases]: 'Press Releases',
};

export const ActiveDateRange = {
	All: 'All',
	SelectPeriod: 'SelectPeriod',
} as const;

export type ActiveDateRangeType = (typeof ActiveDateRange)[keyof typeof ActiveDateRange];

export const dateRangeStateToName: Readonly<Record<ActiveDateRangeType, string>> = {
	[ActiveDateRange.All]: 'All',
	[ActiveDateRange.SelectPeriod]: 'Select period',
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
