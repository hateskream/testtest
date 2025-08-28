import { DisplayVariant } from './display';
import { DateRange, Stock } from './filters';

export interface IState {
	stock: Stock;
	date: DateRange;
	displayVariant: DisplayVariant;
	isCompactMode: boolean;
}

const defaultState: IState = {
	stock: Stock.Industry,
	date: DateRange.Week,
	displayVariant: DisplayVariant.Bar,
	isCompactMode: false,
};

export function getDefaultState() {
	return { ...defaultState };
};
