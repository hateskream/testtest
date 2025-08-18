import type { MarketType } from '@/modules/market';
import type { Score, Sentiment, Source } from './filters';
import type { IDisplaySettings } from './display';
import { LOCATIONS_DEFAULT, type ILocation } from './location';
import type { SortState } from './sort';

export interface IState {
	score: Set<Score>;
	segment: Set<MarketType>;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: ILocation[];
}

const DEFAULT_STATE: IState = {
	score: new Set(),
	segment: new Set(),
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
		isShowSentiment: true,
	},
	locations: LOCATIONS_DEFAULT,
};

export function getDefaultState(): IState {
	return { ...DEFAULT_STATE };
}
