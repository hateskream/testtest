import { FearGreedDashboard } from '@/modules/dashboards-view/dashboards/fear-greed';
import { MarketDashboard } from '@/modules/dashboards-view/dashboards/market';
import { MarketCapDashboard } from '@/modules/dashboards-view/dashboards/market-cap';
import { NewsDashboard } from '@/modules/dashboards-view/dashboards/news';
import { PriceDashboard } from '@/modules/dashboards-view/dashboards/price';
import { DashboardType } from '../model';

export function getDashboardComponent(type: DashboardType) {
	const components = {
		[DashboardType.FearGreed]: FearGreedDashboard,
		[DashboardType.Market]: MarketDashboard,
		[DashboardType.MarketCap]: MarketCapDashboard,
		[DashboardType.News]: NewsDashboard,
		[DashboardType.Price]: PriceDashboard,
	};
	return components[type];
}
