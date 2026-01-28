/* eslint-disable @stylistic/max-len */
import type { AsyncComponentLoader } from 'vue';

import { WidgetType } from '../../core';
import type { DisplayVariant } from '../../layout-dashboards';
import { useLogger } from '@/shared/service/monitoring';

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

export function getWidgetComponent(
	widgetVariant: 'tv' | 'dashboard',
	widgetType: WidgetType,
): AsyncComponentLoader {
	const widgetComponents = {
		[WidgetType.FearGreed]: () => import('@/modules/widgets/fear-greed').then(m => m.TvWidgetComponent),
		[WidgetType.Market]: () => import('@/modules/widgets/market').then(m => m.MarketDashboard),
		[WidgetType.MarketCap]: () => import('@/modules/widgets/market-cap').then(m => m.MarketCapTvWidget),
		[WidgetType.News]: () => import('@/modules/widgets/news').then(m => m.NewsTvWidget),
		[WidgetType.Price]: () => import('@/modules/widgets/price').then(m => m.PriceTvWidget),
		[WidgetType.Watchlist]: () => import('@/modules/widgets/watchlist').then(m => m.WatchlistDashboard),
		[WidgetType.Performance]: () => import('@/modules/widgets/performance').then(m => m.PerformanceTvWidget),
		[WidgetType.AltcoinSeason]: () => import('@/modules/widgets/altcoinSeason').then(m => m.AltcoinSeasonWidget),
		[WidgetType.BitcoinDominance]: () => import('@/modules/widgets/bitcoin-dominance/ui/tv').then(m => m.BitcoinDominanceTvWidget),
		[WidgetType.TopIndices]: () => import('@/modules/widgets/top-indices').then(m => m.TopIndicesTvWidget),
		[WidgetType.Calendar]: () => import('@/modules/widgets/calendar-widget').then(m => m.CalendarTvWidget),
		[WidgetType.Heatmap]: () => import('@/modules/widgets/heatmap').then(m => m.HeatmapDashboard),
		[WidgetType.ChartPrice]: () => import('@/modules/widgets/chart-price').then(m => m.ChartPriceTvWidget),
		[WidgetType.Exchange]: () => import('@/modules/widgets/exchanges').then(m => m.ExchangesDashboard),
		[WidgetType.EthGas]: () => import('@/modules/widgets/eth-gas').then(m => m.EthGasDashboard),

		[WidgetType.MarketCap + '_dash']: () => import('@/modules/widgets/market-cap').then(m => m.MarketCapDashboardWidget),
		[WidgetType.News + '_dash']: () => import('@/modules/widgets/news').then(m => m.NewsDashboardWidget),
		[WidgetType.Price + '_dash']: () => import('@/modules/widgets/price').then(m => m.PriceDashboardWidget),
		[WidgetType.Performance + '_dash']: () => import('@/modules/widgets/performance').then(m => m.PerformanceDashboardWidget),
		[WidgetType.BitcoinDominance + '_dash']: () => import('@/modules/widgets/bitcoin-dominance/ui/dashboard').then(m => m.BitcoinDominanceDashboardWidget),
		[WidgetType.TopIndices + '_dash']: () => import('@/modules/widgets/top-indices').then(m => m.TopIndicesDashboardWidget),
		[WidgetType.Calendar + '_dash']: () => import('@/modules/widgets/calendar-widget').then(m => m.CalendarDashboardWidget),
		[WidgetType.ChartPrice + '_dash']: () => import('@/modules/widgets/chart-price').then(m => m.ChartPriceDashboardWidget),
		[WidgetType.FearGreed + '_dash']: () => import('@/modules/widgets/fear-greed').then(m => m.DashboardWidgetComponent),

		[WidgetType.ConsumerPriceIndex]: () => import('@/modules/widgets/consumer-price-index').then(m => m.ConsumerPriceIndexDashboardWidget),
		[WidgetType.NonfarmPayrolls]: () => import('@/modules/widgets/nonfarm-payrolls').then(m => m.NonfarmPayrollsDashboardWidget),
		[WidgetType.NominalGDP]: () => import('@/modules/widgets/nominal-gdp').then(m => m.NominalGdpDashboardWidget),
		[WidgetType.UnemploymentRate]: () => import('@/modules/widgets/unemployment-rate').then(m => m.UnemploymentRateDashboardWidget),
		[WidgetType.RealGDP]: () => import('@/modules/widgets/real-gdp').then(m => m.RealGdpDashboardWidget),
		[WidgetType.NewsSummary]: () => import('@/modules/widgets/news-summary').then(m => m.NewsSummaryDashboardWidget),
		[WidgetType.HighImpactHourMap]: () => import('@/modules/widgets/high-impact-hour-map').then(m => m.HighImpactHourMapDashboardWidget),
		[WidgetType.UsInflation]: () => import('@/modules/widgets/us-inflation').then(m => m.UsInflationDashboardWidget),
		[WidgetType.FederalFunds]: () => import('@/modules/widgets/federal-funds').then(m => m.FederalFundsDashboardWidget),
	};

	const key = widgetVariant === 'dashboard'
		? widgetType + '_dash'
		: widgetType;

	const loader = widgetComponents[key] ?? widgetComponents[widgetType];
	if (!loader) {
		const logger = useLogger();
		logger.error('Widget not found widget variant', { context: { widgetType, widgetVariant } });
	}

	return loader;
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
