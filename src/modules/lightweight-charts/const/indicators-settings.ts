import { LastPriceAnimationMode, type AreaStyleOptions, type CandlestickStyleOptions,
	type DeepPartial, type LineStyleOptions, type SeriesOptionsCommon } from 'lightweight-charts';

export const MAIN_AREA_SETTINGS: DeepPartial<AreaStyleOptions & SeriesOptionsCommon> = {
	topColor: 'rgba(4, 237, 160, 0.35)',
	bottomColor: 'rgba(4, 237, 160, 0.00)',
	lineColor: 'rgb(4, 237, 160)',
	lineWidth: 2,
	priceLineColor: 'rgba(4, 237, 160, 1)',
	lastPriceAnimation: LastPriceAnimationMode.Continuous,
};

export const MAIN_CANDLESTICK_SETTINGS: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon> = {
	priceLineColor: 'rgba(255, 255, 255, 0.30)',
};


export const MA_SETTINGS: DeepPartial<LineStyleOptions & SeriesOptionsCommon> = {
	color: '#2962FF',
	lineWidth: 1,
	visible: false,
};
