import type { Component } from 'vue';

import { FearGreedDashboard } from '@/modules/dashboards-view/dashboards/fear-greed';
import { MarketDashboard } from '@/modules/dashboards-view/dashboards/market';
import { MarketCapDashboard } from '@/modules/dashboards-view/dashboards/market-cap';
import { NewsDashboard } from '@/modules/dashboards-view/dashboards/news';
import { PriceDashboard } from '@/modules/dashboards-view/dashboards/price';
import { HotMarketsDashboard } from '@/modules/dashboards-view/dashboards/hot-markets';
import { SearchDashboard } from '@/modules/dashboards-view/dashboards/search';
import { InsidersDashboard } from '@/modules/dashboards-view/dashboards/insiders';
import { EventsDashboard } from '@/modules/dashboards-view/dashboards/events';
import { TelegramDashboard } from '@/modules/dashboards-view/dashboards/telegram';
import { ChartDashboard } from '@/modules/dashboards-view/dashboards/chart';
import { DashboardType } from '../model';

export function getDashboardComponent(type: DashboardType) {
	const components: Record<DashboardType, Component> = {
		[DashboardType.FearGreed]: FearGreedDashboard,
		[DashboardType.Market]: MarketDashboard,
		[DashboardType.MarketCap]: MarketCapDashboard,
		[DashboardType.News]: NewsDashboard,
		[DashboardType.Price]: PriceDashboard,
		[DashboardType.HotMarkets]: HotMarketsDashboard,
		[DashboardType.Search]: SearchDashboard,
		[DashboardType.Insiders]: InsidersDashboard,
		[DashboardType.Events]: EventsDashboard,
		[DashboardType.Telegram]: TelegramDashboard,
		[DashboardType.Chart]: ChartDashboard,
	};

	return components[type];
}
