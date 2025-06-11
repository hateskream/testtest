import type { CustomData, CustomSeriesOptions } from 'lightweight-charts';

export interface IHLCAreaData extends CustomData {
	high: number;
	low: number;
	close: number;
}

export interface IHLCAreaBarItem {
	x: number;
	high: number;
	low: number;
	close: number;
}


export interface IHLCAreaSeriesOptions extends CustomSeriesOptions {
	highLineColor: string;
	lowLineColor: string;
	closeLineColor: string;
	areaBottomColor: string;
	areaTopColor: string;
	highLineWidth: number;
	lowLineWidth: number;
	closeLineWidth: number;
}

