import type { Component } from 'vue';

import { WidgetType } from '../../core';
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
import { HeatmapDashboard } from '@/modules/widgets/heatmap';
import { PriceChartDashboard } from '@/modules/widgets/chart-price';

export interface ISize {
	w: number;
	h: number;
}

export interface IMeta {
	widgetId: string;
	isResizing: boolean;
	isLoading: boolean;
	market: string;
	name: string;
	size: ISize;
	maxSize: ISize;
	defaultStateType: string;
	widgetType: WidgetType;
	isOpenFull: boolean;
	dashboards: {
		id: string;
		name: string;
	}[];
}

interface IWidgetComponentProps {
	meta: IMeta;
}

type WidgetComponent = Component<IWidgetComponentProps>;

const components: Record<WidgetType, WidgetComponent> = {
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
	[WidgetType.ChartPrice]: PriceChartDashboard,
};

export function getWidgetComponent(type: WidgetType) {
	return components[type];
}
