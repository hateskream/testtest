export interface IChartPricePoint {
	timestamp: number;
	price: number;
	changePercent: number;
	delta: number;
}

export interface IChartPriceCurrent {
	price: number;
	changePercent: number;
	delta: number;
	prevClosePrice: number;
	updatedAt: string;
}

export interface IChartPriceData {
	points: IChartPricePoint[];
	current: IChartPriceCurrent;
}
