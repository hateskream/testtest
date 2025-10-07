
import { WidgetType } from '../widget';
import type { PresetLayout } from './types';

export const STOCK_DASHBOARD_PRESET: PresetLayout = {
	2: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 3, size: { w: 2, h: 8 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 11, size: { w: 2, h: 6 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 17, size: { w: 2, h: 9 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 26, size: { w: 2, h: 4 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 30, size: { w: 2, h: 8 } } },
	],
	4: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 6 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 6, size: { w: 4, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 19, size: { w: 4, h: 8 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 13, size: { w: 4, h: 6 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 6 } } },
	],
	6: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 4, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 7, size: { w: 4, h: 8 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 4, y: 7, size: { w: 2, h: 8 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 7 } } },
	],
	8: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 4, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 7, size: { w: 6, h: 8 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 6, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 7 } } },
	],
	10: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 5, h: 5 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 5, y: 0, size: { w: 3, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 5, size: { w: 5, h: 11 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 8, y: 0, size: { w: 2, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 5, y: 7, size: { w: 3, h: 9 } } },
	],
	12: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 5, h: 5 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 5, y: 0, size: { w: 4, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 5, size: { w: 5, h: 11 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 9, y: 0, size: { w: 3, h: 16 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 5, y: 7, size: { w: 4, h: 9 } } },
	],
	14: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 7, h: 5 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 7, y: 0, size: { w: 4, h: 8 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 5, size: { w: 7, h: 12 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 11, y: 0, size: { w: 3, h: 17 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 7, y: 8, size: { w: 4, h: 9 } } },
	],
	16: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 5, h: 5 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 8, y: 0, size: { w: 5, h: 15 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 5, size: { w: 5, h: 11 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 13, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 5, y: 0, size: { w: 3, h: 15 } } },
	],
	20: [
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 0, size: { w: 17, h: 7 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 17, y: 0, size: { w: 3, h: 15 } } },
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 7, size: { w: 7, h: 7 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 7, y: 7, size: { w: 4, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 11, y: 7, size: { w: 6, h: 7 } } },
	],
};
