import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';
import { RouteNames } from '@/types/route.d';
import { type FeatureName, isFeatureEnabled, isOnline } from '@/shared/lib';
import { useLogger } from '@/shared/service/monitoring';

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

	if (to.name === RouteNames.Offline) {
		if (!isOnline()) {
			return true;
		}

		return { name: RouteNames.Home };
	}

	if (!isOnline()) {
		if (to.name === RouteNames.Offline) {
			return true;
		}

		return {
			name: RouteNames.Offline,
			query: {
				redirect: to.fullPath,
			},
		};
	}
});

let hasReloaded = false;

router.onError((error, to, from) => {
	const isChunkLoadFailed =
		error?.message?.includes('Failed to fetch dynamically imported module') ||
		error?.message?.includes('Loading chunk');

	const logger = useLogger();
	logger.error(
		'Vue-Router Error',
		{
			error,
			tags: { source: 'vue-router', type: isChunkLoadFailed ? 'chunk-load' : 'navigation' },
			context: { to, from },
		},
	);

	if (isChunkLoadFailed && !hasReloaded) {
		hasReloaded = true;
		window.location.reload();
	}
});
