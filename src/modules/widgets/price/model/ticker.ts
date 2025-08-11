import type { ISymbolCell, INumberCell, IPercentCell, ISvgChartCell } from '@/modules/cell';

export interface ITicker {
	tickerId: string;
	symbol: ISymbolCell;
	priceCurrent: INumberCell;
	changePrice24hPercent: IPercentCell;
	price24hChart: ISvgChartCell;
	isPined: boolean;
	isShow: boolean;
}
