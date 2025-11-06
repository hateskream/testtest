export interface IChartDominanceDataset {
	label: string;
	color: string;
	order: number;
	points: { x: string; y: number }[];
}

export interface IChartMarketCapDataset {
	label: string;
	color: string;
	points: { x: number; y: number }[];
}
