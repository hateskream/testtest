import type { ChartType } from '@shared/component-library';

import {
	createTickerId,
	createTickerIdCommodity,
	createTickerIdForex,
	createTickerIdIndex,
	SymbolType,
} from '@/modules/cell';
import { createPreset, type DateRangeValue, TimezoneUtc } from '@/modules/charts/common/model';
import { ChartPriceDateRangePreset } from './date-range.ts';

export interface IState {
	selectedTicker: string;
	timeRange: DateRangeValue;
}

export function getDefaultsState(defaultStateType: string): IState {
	let defaultSelectedTicker = createTickerId(
		SymbolType.Index,
		createTickerIdIndex('^SPX'),
	);

	if (defaultStateType === 'forex') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Forex,
			createTickerIdForex('EUR', 'USD'),
		);
	}

	if (defaultStateType === 'USDollar') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Index,
			createTickerIdIndex('^DJI'),
		);
	}

	if (defaultStateType === 'Brent Crude Oil') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Commodity,
			createTickerIdCommodity('BZUSD'),
		);
	}

	if (defaultStateType === 'NDX') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Index,
			createTickerIdIndex('^NDX'),
		);
	}

	return {
		selectedTicker: defaultSelectedTicker,
		timeRange: createPreset(ChartPriceDateRangePreset.Day),
	};
}

export function getDefaultTimezone() {
	return TimezoneUtc.UTC0;
}

export function getDefaultChartType(): ChartType {
	return 'area';
}
