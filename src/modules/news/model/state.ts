import type { WidgetState } from '@/modules/dashboard-group';
import { MarketType } from '@/modules/market';
import {
	compareArray,
	compareFilter,
	type IncludeType,
	type ScoreType,
	type SentimentType,
	type SourceType,
} from './filters';
import { compareDisplaySettings, type IDisplaySettings } from './display';
import {
	compareLocations,
	getActiveLocations,
	type IActiveLocation,
	type ILocation,
	LOCATIONS_DEFAULT,
	rehydrateLocations,
} from './location';
import { compareSort, type SortState } from './sort';

export interface IState extends WidgetState {
	score: Set<ScoreType>;
	segments: Set<MarketType>;
	sentiment: Set<SentimentType>;
	source: Set<SourceType>;
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: ILocation[];
	include: Set<IncludeType>;
}

export interface IHydratedState extends WidgetState {
	score: ScoreType[];
	segments: MarketType[];
	sentiment: SentimentType[];
	source: SourceType[];
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: IActiveLocation[];
	include: IncludeType[];
}

export function hydrateState({
	score,
	segments,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	displaySettings,
	locations,
	include,
}: IState) {
	return {
		score: Array.from(score),
		segments: Array.from(segments),
		sentiment: Array.from(sentiment),
		source: Array.from(source),
		selectedTickers: selectedTickers,
		activeSort: activeSort,
		displaySettings: displaySettings,
		locations: getActiveLocations(locations),
		include: Array.from(include),
	};
}

export function rehydrateState({
	score,
	segments,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	displaySettings,
	locations,
	include,
}: IHydratedState,
): IState {
	return {
		score: new Set(score),
		segments: new Set(segments),
		sentiment: new Set(sentiment),
		source: new Set(source),
		selectedTickers,
		activeSort,
		displaySettings,
		locations: rehydrateLocations(LOCATIONS_DEFAULT, locations),
		include: new Set(include),
	};
}

export function compareState(state1: IState, state2: IState): boolean {
	if (!compareFilter(state1.score, state2.score)) {
		return false;
	}
	if (!compareArray(Array.from(state1.segments), Array.from(state2.segments))) {
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
	if (!compareArray(Array.from(state1.include), Array.from(state2.include))) {
		return false;
	}

	return true;
}

function compareTicker(arr1: unknown[], arr2: unknown[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i += 1) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}
