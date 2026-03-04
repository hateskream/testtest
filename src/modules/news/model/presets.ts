import { endOfWeek, startOfWeek } from 'date-fns';

import {
	ActiveDateRange,
	type ActiveDateRangeType,
	type IState,
	LOCATIONS_DEFAULT,
	Score,
	segmentsData,
	Sentiment,
} from '@/modules/news';
import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';
import type { IDateRange } from '@/shared/ui/calendar';

export function toUtcIsoDate(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

export function getStartOfWeek(date: Date): Date {
	return startOfWeek(date, {
		weekStartsOn: 1,
	});
}

export function getEndOfWeek(date: Date): Date {
	return endOfWeek(date, {
		weekStartsOn: 1,
	});
}

export const DEFAULT_STATE: IState = {
	score: new Set(),
	segments: new Set(ALL_MARKET_TYPES),
	sentiment: new Set(),
	source: new Set(),
	selectedTickers: [],
	activeSort: null,
	displaySettings: {
		isShowDate: true,
		isShowSource: true,
		isShowDesc: true,
		isShowAuthor: true,
		isShowSymbols: true,
		isShowScore: true,
	},
	locations: LOCATIONS_DEFAULT,
	include: new Set(),
};

export function getDefaultState(defaultState?: string): IState {
	switch (defaultState) {
		case 'crypto':
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Low, Score.Medium, Score.High]),
				sentiment: new Set([Sentiment.Neutral, Sentiment.Optimistic]),
			};

		case 'stock':
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Medium, Score.High]),
				sentiment: new Set([Sentiment.Optimistic]),
			};

		case 'forex':
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Low, Score.Medium]),
				sentiment: new Set([Sentiment.Pessimistic, Sentiment.Neutral]),
			};

		case 'commodities':
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Medium]),
				sentiment: new Set([Sentiment.Neutral]),
			};

		case 'indices':
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Low, Score.High]),
				sentiment: new Set([Sentiment.Optimistic, Sentiment.Pessimistic]),
			};

		case 'full-metrics':
		default:
			return {
				...DEFAULT_STATE,
				score: new Set([Score.Low, Score.Medium, Score.High]),
				sentiment: new Set([
					Sentiment.Neutral,
					Sentiment.Pessimistic,
					Sentiment.Optimistic,
				]),
			};
	}
}

export function getDefaultSegmentMarkets(defaultState?: string): MarketType[] {
	switch (defaultState) {
		case 'crypto':
			return [MarketType.Crypto];

		case 'stock':
			return [MarketType.Stock];

		case 'forex':
			return [MarketType.Forex];

		case 'commodities':
			return [MarketType.Commodities];

		case 'indices':
			return [MarketType.Indices];

		case 'full-metrics':
		default:
			return segmentsData.map(seg => seg.id);
	}
}

export function getDefaultDateRange(): IDateRange {
	return {
		from: toUtcIsoDate(getStartOfWeek(new Date())),
		to: toUtcIsoDate(getEndOfWeek(new Date())),
	};
}

export function getDefaultActiveDateRange(): ActiveDateRangeType {
	return ActiveDateRange.All;
}
