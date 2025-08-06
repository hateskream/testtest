import type { Component } from 'vue';

import { FearGreedDashboard } from '@/modules/widgets/fear-greed';
import { MarketDashboard } from '@/modules/widgets/market';
import { MarketCapDashboard } from '@/modules/widgets/market-cap';
import { NewsDashboard } from '@/modules/widgets/news';
import { PriceDashboard } from '@/modules/widgets/price';
import { HotMarketsDashboard } from '@/modules/widgets/hot-markets';
import { SearchDashboard } from '@/modules/widgets/search';
import { InsidersDashboard } from '@/modules/widgets/insiders';
import { EventsDashboard } from '@/modules/widgets/events';
import { TelegramDashboard } from '@/modules/widgets/telegram';
import { ChartDashboard } from '@/modules/widgets/chart';
import { WatchlistDashboard } from '@/modules/widgets/watchlist';
import { PerformanceWidget } from '@/modules/widgets/performance';
import { AltcoinSeasonWidget } from '@/modules/widgets/altcoinSeason';
import { BitcoinDominance } from '@/modules/widgets/bitcoin-dominance';
import { TopIndicesWidget } from '@/modules/widgets/top-indices';
import { WidgetType } from '../../core';

export function getWidgetComponent(type: WidgetType) {
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
		[WidgetType.Watchlist]: WatchlistDashboard,
		[WidgetType.Performance]: PerformanceWidget,
		[WidgetType.AltcoinSeason]: AltcoinSeasonWidget,
		[WidgetType.BitcoinDominance]: BitcoinDominance,
		[WidgetType.TopIndices]: TopIndicesWidget,
	};

	return components[type];
}
