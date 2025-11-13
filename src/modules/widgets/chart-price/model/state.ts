import {
	createTickerId,
	createTickerIdCommodity,
	createTickerIdForex,
	createTickerIdIndex,
	SymbolType,
} from '@/modules/cell';
import {
	TimeRangeFilterValue,
} from './time-range';

export interface IState {
	selectedTicker: string;
	timeRange: TimeRangeFilterValue;
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

	return {
		selectedTicker: defaultSelectedTicker,
		timeRange: TimeRangeFilterValue.Day,
	};
}
