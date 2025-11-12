import { ActiveDateRange, type IState, LOCATIONS_DEFAULT, Score, Sentiment } from '@/modules/news';
import { MarketType } from '@/modules/market';
import { getEndOfWeek, getStartOfWeek, toUtcIsoDate } from '@/modules/calendar';

export const DEFAULT_STATE: IState = {
	score: new Set(),
	segments: new Set(),
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
	activeDateRange: ActiveDateRange.All,
	dateRange: {
		from: toUtcIsoDate(getStartOfWeek(new Date())),
		to: toUtcIsoDate(getEndOfWeek(new Date())),
	},
};

export function getDefaultState(defaultState?: string): IState {
	switch (defaultState) {
		case 'crypto':
			return {
				...DEFAULT_STATE,
				segments: new Set([MarketType.Crypto]),
				score: new Set([Score.Low, Score.Medium, Score.High]),
				sentiment: new Set([Sentiment.Neutral, Sentiment.Optimistic]),
			};

		case 'stock':
			return {
				...DEFAULT_STATE,
				segments: new Set([MarketType.Stock]),
				score: new Set([Score.Medium, Score.High]),
				sentiment: new Set([Sentiment.Optimistic]),
			};

		case 'forex':
			return {
				...DEFAULT_STATE,
				segments: new Set([MarketType.Forex]),
				score: new Set([Score.Low, Score.Medium]),
				sentiment: new Set([Sentiment.Pessimistic, Sentiment.Neutral]),
			};

		case 'commodities':
			return {
				...DEFAULT_STATE,
				segments: new Set([MarketType.Commodities]),
				score: new Set([Score.Medium]),
				sentiment: new Set([Sentiment.Neutral]),
			};

		case 'indices':
			return {
				...DEFAULT_STATE,
				segments: new Set([MarketType.Indices]),
				score: new Set([Score.Low, Score.High]),
				sentiment: new Set([Sentiment.Optimistic, Sentiment.Pessimistic]),
			};

		case 'full-metrics':
		default:
			return {
				...DEFAULT_STATE,
				segments: new Set(Object.values(MarketType)),
				score: new Set([Score.Low, Score.Medium, Score.High]),
				sentiment: new Set([
					Sentiment.Neutral,
					Sentiment.Pessimistic,
					Sentiment.Optimistic,
				]),
			};
	}
}
