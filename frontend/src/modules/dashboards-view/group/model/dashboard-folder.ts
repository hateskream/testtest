import { DashboardType } from './types';

export const dashboardTypeToFolderNameMapping: Record<DashboardType, string> = {
	[DashboardType.FearGreed]: 'Fear & Greed',
	[DashboardType.Market]: 'Market',
	[DashboardType.MarketCap]: 'Market Cap',
	[DashboardType.News]: 'News',
	[DashboardType.Price]: 'Price',
};
