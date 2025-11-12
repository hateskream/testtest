import {
	ActiveDateRange, ensureSegmentsTickersLoaded,
	type IState,
	LOCATIONS_DEFAULT,
	parseTicker,
	Score,
	segmentsData,
	type SelectedSegmentTickersState,
	Sentiment,
} from '@/modules/news';
import { MarketType } from '@/modules/market';
import { getEndOfWeek, getStartOfWeek, toUtcIsoDate } from '@/modules/calendar';

export const DEFAULT_STATE: IState = {
	score: new Set(),
	segments: new Set(Object.values(MarketType)),
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

export function getDefaultSegmentTickers(defaultState?: string) {
	const map: SelectedSegmentTickersState = {};

	const selectAll = (id: MarketType) => {
		const segment = segmentsData.find(s => s.id === id);

		if (!segment) {
			return new Set<string>();
		}

		if (!segment.tickers.length) {
			return new Set<string>();
		}

		return new Set(segment.tickers.map(ticker => parseTicker(id, ticker)));
	};

	ensureSegmentsTickersLoaded().then(() => {
		switch (defaultState) {
			case 'crypto':
				map[MarketType.Crypto] = selectAll(MarketType.Crypto);
				break;

			case 'stock':
				map[MarketType.Stock] = selectAll(MarketType.Stock);
				break;

			case 'forex':
				map[MarketType.Forex] = selectAll(MarketType.Forex);
				break;

			case 'commodities':
				map[MarketType.Commodities] = selectAll(MarketType.Commodities);
				break;

			case 'indices':
				map[MarketType.Indices] = selectAll(MarketType.Indices);
				break;

			case 'full-metrics':
			default:
				for (const seg of segmentsData) {
					map[seg.id] = selectAll(seg.id);
				}
				break;
		}
	});

	return map;
}
