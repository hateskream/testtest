import type { Component } from 'vue';

import { FearGreedDashboard } from '@/modules/widgets/fear-greed';
import { MarketDashboard } from '@/modules/widgets/market';
import { MarketCapDashboardWidget, MarketCapTvWidget } from '@/modules/widgets/market-cap';
import { NewsDashboardWidget, NewsTvWidget } from '@/modules/widgets/news';
import { PriceDashboardWidget, PriceTvWidget } from '@/modules/widgets/price';
import { WatchlistDashboard } from '@/modules/widgets/watchlist';
import { PerformanceTvWidget, PerformanceDashboardWidget } from '@/modules/widgets/performance';
import { AltcoinSeasonWidget } from '@/modules/widgets/altcoinSeason';
import { TopIndicesDashboardWidget, TopIndicesTvWidget } from '@/modules/widgets/top-indices';
import { CalendarDashboardWidget, CalendarTvWidget } from '@/modules/widgets/calendar-widget';
import { HeatmapDashboard } from '@/modules/widgets/heatmap';
import { ChartPriceDashboardWidget, ChartPriceTvWidget } from '@/modules/widgets/chart-price';
import { ExchangesDashboard } from '@/modules/widgets/exchanges';
import { EthGasDashboard } from '@/modules/widgets/eth-gas';
import { WidgetType, type DisplayVariant } from '@/modules/dashboard-group';
import { BitcoinDominanceTvWidget } from '@/modules/widgets/bitcoin-dominance/ui/tv';
import { BitcoinDominanceDashboardWidget } from '@/modules/widgets/bitcoin-dominance/ui/dashboard';

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
	columnWidth: number;
	rowHeight: number;
	dashboards: {
		id: string;
		name: string;
	}[];
	maxCountRowTable?: number;
	activeDisplayVariant: DisplayVariant;
	allDisplayVariants: DisplayVariant[];
}

interface IWidgetComponentProps {
	meta: IMeta;
}

type WidgetComponent = Component<IWidgetComponentProps>;

const componentsTv: Partial<Record<WidgetType, WidgetComponent>> = {
	[WidgetType.FearGreed]: FearGreedDashboard,
	[WidgetType.Market]: MarketDashboard,
	[WidgetType.MarketCap]: MarketCapTvWidget,
	[WidgetType.News]: NewsTvWidget,
	[WidgetType.Price]: PriceTvWidget,
	[WidgetType.Watchlist]: WatchlistDashboard,
	[WidgetType.Performance]: PerformanceTvWidget,
	[WidgetType.AltcoinSeason]: AltcoinSeasonWidget,
	[WidgetType.BitcoinDominance]: BitcoinDominanceTvWidget,
	[WidgetType.TopIndices]: TopIndicesTvWidget,
	[WidgetType.Calendar]: CalendarTvWidget,
	[WidgetType.Heatmap]: HeatmapDashboard,
	[WidgetType.ChartPrice]: ChartPriceTvWidget,
	[WidgetType.Exchange]: ExchangesDashboard,
	[WidgetType.EthGas]: EthGasDashboard,
};

const componentsDashboard: Partial<Record<WidgetType, WidgetComponent>> = {
	[WidgetType.FearGreed]: FearGreedDashboard,
	[WidgetType.Market]: MarketDashboard,
	[WidgetType.MarketCap]: MarketCapDashboardWidget,
	[WidgetType.News]: NewsDashboardWidget,
	[WidgetType.Price]: PriceDashboardWidget,
	[WidgetType.Watchlist]: WatchlistDashboard,
	[WidgetType.Performance]: PerformanceDashboardWidget,
	[WidgetType.AltcoinSeason]: AltcoinSeasonWidget,
	[WidgetType.BitcoinDominance]: BitcoinDominanceDashboardWidget,
	[WidgetType.TopIndices]: TopIndicesDashboardWidget,
	[WidgetType.Calendar]: CalendarDashboardWidget,
	[WidgetType.Heatmap]: HeatmapDashboard,
	[WidgetType.ChartPrice]: ChartPriceDashboardWidget,
	[WidgetType.Exchange]: ExchangesDashboard,
	[WidgetType.EthGas]: EthGasDashboard,
};

export function getWidgetComponent(widgetVariant: 'tv' | 'dashboard', widgetType: WidgetType) {
	return widgetVariant === 'dashboard' ? componentsDashboard[widgetType] : componentsTv[widgetType];
}

const PREFIX_FULL_VIEW = 'ephemeral';

export function generateId(id: string) {
	return `${PREFIX_FULL_VIEW}${id}`;
}

export function getParentId(str: string) {
	return str.replace(PREFIX_FULL_VIEW, '');
}

export function isChild(str: string) {
	return str.startsWith(PREFIX_FULL_VIEW);
}
