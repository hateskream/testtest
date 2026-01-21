import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';
import { RouteNames } from '@/types/route.d';
import { type FeatureName, isFeatureEnabled } from '@/shared/lib';

export const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

const PAGE_ENABLED_FEATURES: Partial<Record<RouteNames, FeatureName>> = {
	[RouteNames.Screener]: 'SCREENER_PAGE_ENABLED',
	[RouteNames.Heatmap]: 'HEATMAP_PAGE_ENABLED',
	[RouteNames.Calendar]: 'CALENDAR_PAGE_ENABLED',
	[RouteNames.News]: 'NEWS_PAGE_ENABLED',
	[RouteNames.Tv]: 'TV_PAGE_ENABLED',
	[RouteNames.TickerPageFooter]: 'TICKER_PAGE_FOOTER_ENABLED',
	[RouteNames.LinksTestPage]: 'LINKS_WIDGET_PAGE_ENABLED',
	[RouteNames.KeyIndicatorsTest]: 'KEY_INDICATORS_PAGE_ENABLED',
	[RouteNames.TickerWidget]: 'TICKER_WIDGET_PAGE_ENABLED',
	[RouteNames.TickerWidgetPreview]: 'TICKER_WIDGET_PAGE_ENABLED',
};

router.beforeEach((to) => {
	for (const record of to.matched) {
		const feature = PAGE_ENABLED_FEATURES[record.name as RouteNames];

		if (feature && !isFeatureEnabled(feature)) {
			return false;
		}
	}

	if (!isFeatureEnabled('TICKER_NAVIGATION_ENABLED') && to.path.startsWith('/ticker')) {
		return false;
	}
});
