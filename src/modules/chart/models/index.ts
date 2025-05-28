import { IconIds } from '@/shared/ui/icon';

export interface IPeriodData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

export interface IAllTimeData {
	high: {
		value: number;
		date: string;
		percentage: number;
	};
	low: {
		value: number;
		date: string;
		percentage: number;
	};
}

export interface IExchange {
	id: number;
	source: string;
	fullName: string;
	symbol: string;
	currency: string;
	currency_symbol: string;
	displaySymbol: string;
	isPrimary: boolean;
	price: number;
	change: {
		points: number;
		percentage: number;
	};
	openTime: string;
	closeTime: string;
	iconId: IconIds;
	periods: {
		'1D': IPeriodData;
		'1W': IPeriodData;
		'1M': IPeriodData;
		'3M': IPeriodData;
		'1Y': IPeriodData;
	};
	allTime: IAllTimeData;
}

export interface IPriceRange {
	min: number;
	max: number;
}
