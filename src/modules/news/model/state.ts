import {
	compareArray,
	compareFilter,
	ActiveDateRange,
	Include,
	type Score,
	type Sentiment,
	type Source,
} from './filters';
import { compareDisplaySettings, type IDisplaySettings } from './display';
import {
	type IActiveLocation,
	type ILocation,
	LOCATIONS_DEFAULT,
	rehydrateLocations,
} from './location';
import { compareLocations, getActiveLocations } from '../utils';
import { compareSort, type SortState } from './sort';
import { MarketType } from '@/modules/market';
import type { IDateRange } from '@/shared/ui/calendar';

export interface IState {
	score: Set<Score>;
	segments: Set<MarketType>;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: ILocation[];
	include: Set<Include>;
	activeDateRange: ActiveDateRange;
	dateRange: IDateRange;
}

export interface IHydratedState {
	score: Score[];
	segments: MarketType[];
	sentiment: Sentiment[];
	source: Source[];
	selectedTickers: string[];
	activeSort: SortState;
	displaySettings: IDisplaySettings;
	locations: IActiveLocation[];
	include: Include[];
	activeDateRange: ActiveDateRange;
	dateRange: IDateRange;
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
	activeDateRange,
	dateRange,
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
		activeDateRange: activeDateRange,
		dateRange: dateRange,
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
	activeDateRange,
	dateRange,
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
		activeDateRange: activeDateRange,
		dateRange: dateRange,
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
	if (state1.activeDateRange !== state2.activeDateRange) {
		return false;
	}
	if (state1.dateRange.from !== state2.dateRange.from || state1.dateRange.to !== state2.dateRange.to) {
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
