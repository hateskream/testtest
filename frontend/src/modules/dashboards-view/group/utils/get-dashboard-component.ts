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
import { WidgetType } from '../model';

export function getDashboardComponent(type: WidgetType) {
	const components: Record<WidgetType, Component> = {
		[WidgetType.FearGreed]: FearGreedDashboard,
		[WidgetType.Market]: MarketDashboard,
		[WidgetType.MarketCap]: MarketCapDashboard,
		[WidgetType.News]: NewsDashboard,
		[WidgetType.Price]: PriceDashboard,
		[WidgetType.HotMarkets]: HotMarketsDashboard,
		[WidgetType.Search]: SearchDashboard,
		[WidgetType.Insiders]: InsidersDashboard,
		[WidgetType.Events]: EventsDashboard,
		[WidgetType.Telegram]: TelegramDashboard,
		[WidgetType.Chart]: ChartDashboard,
	};

	return components[type];
}
