import type { Component } from 'vue';

import { FearGreedDashboard } from '@/modules/widgets/fear-greed';
import { MarketDashboard } from '@/modules/widgets/market';
import { MarketCapDashboard } from '@/modules/widgets/market-cap';
import { NewsDashboard } from '@/modules/widgets/news';
import { PriceDashboard } from '@/modules/widgets/price';
import { WatchlistDashboard } from '@/modules/widgets/watchlist';
import { PerformanceWidget } from '@/modules/widgets/performance';
import { AltcoinSeasonWidget } from '@/modules/widgets/altcoinSeason';
import { BitcoinDominance } from '@/modules/widgets/bitcoin-dominance';
import { TopIndicesWidget } from '@/modules/widgets/top-indices';
import { CalendarWidget } from '@/modules/widgets/calendar-widget';
import { WidgetType } from '../../core';
import { HeatmapDashboard } from '@/modules/widgets/heatmap';

export function getWidgetComponent(type: WidgetType) {
	const components: Record<WidgetType, Component> = {
		[WidgetType.FearGreed]: FearGreedDashboard,
		[WidgetType.Market]: MarketDashboard,
		[WidgetType.MarketCap]: MarketCapDashboard,
		[WidgetType.News]: NewsDashboard,
		[WidgetType.Price]: PriceDashboard,
		[WidgetType.Watchlist]: WatchlistDashboard,
		[WidgetType.Performance]: PerformanceWidget,
		[WidgetType.AltcoinSeason]: AltcoinSeasonWidget,
		[WidgetType.BitcoinDominance]: BitcoinDominance,
		[WidgetType.TopIndices]: TopIndicesWidget,
		[WidgetType.Calendar]: CalendarWidget,
		[WidgetType.Heatmap]: HeatmapDashboard,
	};

	return components[type];
}
