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
import { HeatmapDashboard } from '@/modules/widgets/heatmap';
import { PriceChartDashboard } from '@/modules/widgets/chart-price';
import { ExchangesDashboard } from '@/modules/widgets/exchanges';
import { EthGasDashboard } from '@/modules/widgets/eth-gas';
import { WidgetType } from '@/modules/dashboard-group';

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
	[WidgetType.Exchange]: ExchangesDashboard,
	[WidgetType.EthGas]: EthGasDashboard,
};

export function getWidgetComponent(type: WidgetType) {
	return components[type];
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
