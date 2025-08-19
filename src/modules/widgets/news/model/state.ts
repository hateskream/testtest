import type { MarketType } from '@/modules/market';
import type { Score, Sentiment, Source } from './filters';
import type { IDisplaySettings } from './display';
import {
	getActiveLocations,
	LOCATIONS_DEFAULT,
	rehydrateLocations,
	type IActiveLocation,
	type ILocation,
} from './location';
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
	return cloneState(DEFAULT_STATE);
}

export interface IHydrationState {
	score: Score[];
	segment: MarketType[];
	sentiment: Sentiment[];
	source: Source[];
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: IActiveLocation[];
}

export function hydrateState({
	score,
	segment,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	displaySettings,
	locations,
}: IState): IHydrationState {
	return {
		score: Array.from(score),
		segment: Array.from(segment),
		sentiment: Array.from(sentiment),
		source: Array.from(source),
		selectedTickers,
		activeSort,
		displaySettings,
		locations: getActiveLocations(locations),
	};
}

export function rehydrateState({
	score,
	segment,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	displaySettings,
	locations,
}: IHydrationState,
): IState {
	return {
		score: new Set(score),
		segment: new Set(segment),
		sentiment: new Set(sentiment),
		source: new Set(source),
		selectedTickers,
		activeSort,
		displaySettings,
		locations: rehydrateLocations(LOCATIONS_DEFAULT, locations),
	};
}

export function cloneState(state: IState): IState {
	return {
		score: new Set(state.score),
		segment: new Set(state.segment),
		sentiment: new Set(state.sentiment),
		source: new Set(state.source),
		selectedTickers: [...state.selectedTickers],
		activeSort: state.activeSort,
		displaySettings: { ...state.displaySettings },
		locations: state.locations.map(location => ({ ...location })),
	};
}
