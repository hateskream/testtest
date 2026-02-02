import {
	createTickerId,
	createTickerIdCommodity,
	createTickerIdForex,
	createTickerIdIndex,
	SymbolType,
} from '@/modules/cell';
import { createPreset, DateRangePreset, type DateRangeValue } from '@/modules/lightweight-charts/model';

export interface IState {
	selectedTicker: string;
	timeRange: DateRangeValue;
}

export function getDefaultsState(defaultStateType: string): IState {
	let defaultSelectedTicker = createTickerId(
		SymbolType.Index,
		createTickerIdIndex('SPX'),
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
			createTickerIdIndex('DXY'),
		);
	}

	if (defaultStateType === 'Gold') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Commodity,
			createTickerIdCommodity('XAUUSD'),
		);
	}

	if (defaultStateType === 'NDX') {
		defaultSelectedTicker = createTickerId(
			SymbolType.Index,
			createTickerIdIndex('NDX'),
		);
	}

	return {
		selectedTicker: defaultSelectedTicker,
		timeRange: createPreset(DateRangePreset.Day),
	};
}
