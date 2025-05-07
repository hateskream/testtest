import { WidgetType } from './widgets';

export const dashboardTypeToFolderNameMapping: Record<WidgetType, string> = {
	[WidgetType.FearGreed]: 'Fear & Greed',
	[WidgetType.Market]: 'Market',
	[WidgetType.MarketCap]: 'Market Cap',
	[WidgetType.News]: 'News',
	[WidgetType.Price]: 'Price',
	[WidgetType.HotMarkets]: 'Hot Markets',
	[WidgetType.Search]: 'Search',
	[WidgetType.Insiders]: 'Insiders',
	[WidgetType.Events]: 'Events',
	[WidgetType.Telegram]: 'Telegram',
	[WidgetType.Chart]: 'BTCUSDT',
};
