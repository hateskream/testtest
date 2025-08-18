import type { MarketType } from '@/modules/market';
import type { Score, Sentiment, Source } from './filters';
import type { Sort } from './sort';
import type { IDisplaySettings } from './display';
import type { ILocation } from './location';

export interface IState {
	score: Set<Score>;
	segment: Set<MarketType>;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: Sort | null;
	displaySettings: IDisplaySettings;
	locations: ILocation[];
}
