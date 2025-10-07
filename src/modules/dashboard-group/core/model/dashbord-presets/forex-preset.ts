import { WidgetType } from '../widget';
import type { PresetLayout } from './types';

export const FOREX_DASHBOARD_PRESET: PresetLayout = {
	2: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 9 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 15, size: { w: 2, h: 9 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 9, size: { w: 2, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 24, size: { w: 2, h: 4 } } },
	],
	4: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 7, size: { w: 4, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 13, size: { w: 4, h: 5 } } },
	],
	6: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 4, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 4, y: 7, size: { w: 2, h: 8 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 7, size: { w: 4, h: 8 } } },
	],
	8: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 6 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 4, y: 0, size: { w: 2, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 6, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 2, y: 6, size: { w: 4, h: 9 } } },
	],
	10: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 3, h: 6 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 5, y: 0, size: { w: 3, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 8, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 2, y: 6, size: { w: 6, h: 9 } } },
	],
	12: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 3, y: 0, size: { w: 3, h: 6 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 6, y: 0, size: { w: 3, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 9, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 3, y: 6, size: { w: 6, h: 9 } } },
	],
	14: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 3, h: 7 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 7, size: { w: 3, h: 8 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 3, y: 0, size: { w: 8, h: 7 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 11, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 3, y: 7, size: { w: 8, h: 8 } } },
	],
	16: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 3, h: 6 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 6, size: { w: 3, h: 9 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 9, y: 0, size: { w: 4, h: 15 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 13, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 3, y: 0, size: { w: 6, h: 15 } } },
	],
	20: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 7, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 10, y: 0, size: { w: 7, h: 15 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 17, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 2, y: 0, size: { w: 5, h: 15 } } },
	],
};
