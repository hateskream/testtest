import type { MarketType } from '@/modules/market';
import { compareFilter, type Score, type Sentiment, type Source } from './filters';
import { compareDisplaySettings, type IDisplaySettings } from './display';
import {
	compareLocations,
	getActiveLocations,
	LOCATIONS_DEFAULT,
	rehydrateLocations,
	type IActiveLocation,
	type ILocation,
} from './location';
import { compareSort, type SortState } from './sort';

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

export interface IHydratedState {
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
}: IState): IHydratedState {
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
}: IHydratedState,
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

export function compareState(state1: IState, state2: IState): boolean {
	if (!compareFilter(state1.score, state2.score)) {
		return false;
	}
	if (!compareFilter(state1.segment, state2.segment)) {
		return false;
	}
	if (!compareFilter(state1.sentiment, state2.sentiment)) {
		return false;
	}
	if (!compareFilter(state1.source, state2.source)) {
		return false;
	}

	if (!compareTicker(state1.selectedTickers, state2.selectedTickers)) {
		return false;
	}

	if (!compareSort(state1.activeSort, state2.activeSort)) {
		return false;
	}

	if (!compareDisplaySettings(state1.displaySettings, state2.displaySettings)) {
		return false;
	}

	if (!compareLocations(state1.locations, state2.locations)) {
		return false;
	}

	return true;
}


function compareTicker(arr1: unknown[], arr2: unknown[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}
