import { WidgetType } from '@/modules/dashboard-group/core/domains/entities/widget/widget-type';
import type { FeatureName } from '@/shared/lib/feature-toggle';

export const WidgetTypeToFeature: Record<WidgetType, FeatureName> = {
	[WidgetType.FearGreed]: 'WIDGET_FEAR_GREED',
	[WidgetType.Market]: 'WIDGET_MARKET',
	[WidgetType.MarketCap]: 'WIDGET_MARKET_CAP',
	[WidgetType.News]: 'WIDGET_NEWS',
	[WidgetType.Price]: 'WIDGET_PRICE_LIST',
	[WidgetType.HotMarkets]: 'WIDGET_HOT_MARKETS',
	[WidgetType.Watchlist]: 'WIDGET_WATCH_LIST',
	[WidgetType.Performance]: 'WIDGET_PERFORMANCE',
	[WidgetType.AltcoinSeason]: 'WIDGET_ALTCOIN_SEASON',
	[WidgetType.TopIndices]: 'WIDGET_TOP_INDICES',
	[WidgetType.BitcoinDominance]: 'WIDGET_BITCOIN_DOMINANCE',
	[WidgetType.Calendar]: 'WIDGET_CALENDAR',
};
