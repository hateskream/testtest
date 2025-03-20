import { DashboardType } from './types';

export const dashboardTypeToFolderNameMapping: Record<DashboardType, string> = {
	[DashboardType.FearGreed]: 'Fear & Greed',
	[DashboardType.Market]: 'Market',
	[DashboardType.MarketCap]: 'Market Cap',
	[DashboardType.News]: 'News',
	[DashboardType.Price]: 'Price',
	[DashboardType.HotMarkets]: 'Hot Markets',
	[DashboardType.Search]: 'Search',
	[DashboardType.Insiders]: 'Insiders',
	[DashboardType.Events]: 'Events',
	[DashboardType.Telegram]: 'Telegram',
};
