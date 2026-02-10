import { useLogger } from '@/shared/service/monitoring';

let isConfigValidated = false;

function checkIsConfigValidated() {
	if (!isConfigValidated) {
		throw new Error('Config is not validated');
	}
}

/**
 * List of experimental widget features.
 */
export const EXPERIMENTAL_WIDGETS_FEATURES = [
	'SHOW_FEAR_AND_GREED_WIDGET',
	'SHOW_MARKET_CAP_WIDGET_DASHBOARD',
	'SHOW_ETH_GAS_WIDGET_DASHBOARD',
] as const;

/**
 * Complete list of all available feature flags in the application.
 * Each feature corresponds to an environment variable without `VITE_FEATURE_` prefix.
 */
export const ALL_FEATURES = [
	'DASHBOARD_PRESETS',
	'DRAG_WIDGET_ENABLED',
	'CONTEXT_MENU_WIDGET_ACTIONS',
	'TICKER_NAVIGATION_ENABLED',
	'CRYPTO_DASHBOARD_ENABLED',
	'STOCK_DASHBOARD_ENABLED',

	'SHOW_DASHBOARD_WATCHLIST',
	'SHOW_DASHBOARD_WIDGET_DISPLAY_VARIANTS',

	'SHOW_HELP_PAGE_LINK',
	'SHOW_TRAY_PAGE_LINK',
	'SHOW_SET_UP_PAGE_LINK',
	'SHOW_CASHFLOW_PAGE_LINK',
	'SHOW_ARBITRAGE_PAGE_LINK',
	'SHOW_SEARCH_PAGE_LINK',
	'SHOW_ASK_AI_PAGE_LINK',

	'SCREENER_PAGE_ENABLED',
	'HEATMAP_PAGE_ENABLED',
	'CALENDAR_PAGE_ENABLED',
	'NEWS_PAGE_ENABLED',
	'TV_PAGE_ENABLED',
	'TICKER_PAGE_FOOTER_ENABLED',
	'TICKER_PAGE_HEADER_ENABLED',
	'LINKS_WIDGET_PAGE_ENABLED',
	'TICKER_WIDGET_PAGE_ENABLED',
	'TICKER_WIDGET_ACTIVITY_METRICS_ENABLED',
	'TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED',
	'TICKER_WIDGET_INDICATORS_ENABLED',
	'DATE_FORMAT_LOCALIZATION',
	'RESIZE_HEIGHT_WIDGETS',
	'RESIZE_WIDTH_SECTIONS',

	'WIDGET_HIGH_IMPACT_HOUR_MAP_CALENDAR_REDIRECT',
	'WIDGET_CHART_TIMELINE_EVENTS',
	'WIDGET_NEWS_SELECT_NEWS_ITEM',
	'KEY_INDICATORS_PAGE_ENABLED',

	'I88_TWITTER_PAGE_LINK',
	'I88_DISCORD_SUPPORT_LINK',
	'I88_FEATURE_REQUEST_LINK',
	'TICKER_PAGE_HEADER_MORE_OPTIONS_ENABLED',

	'CALENDAR_OPEN_CHART',

	...EXPERIMENTAL_WIDGETS_FEATURES,
] as const;

export type FeatureName = typeof ALL_FEATURES[number];

/**
 * Checks if a specific feature is enabled.
 * @param feature - The name of the feature to check.
 * @returns `true` if the feature is enabled, `false` otherwise.
 * @throws Error if config is not validated or feature name is invalid.
 */
export function isFeatureEnabled(feature: FeatureName): boolean {
	checkIsConfigValidated();

	if (!ALL_FEATURES.includes(feature)) {
		throw new Error(`Invalid feature name: ${feature}. Must be one of: ${ALL_FEATURES.join(', ')}`);
	}

	const envVar = import.meta.env[`VITE_FEATURE_${feature}`] as string;
	return envVar.toLowerCase() === 'true';
}

/**
 * Gets the raw string value of a feature flag from environment variables.
 * @param feature - The name of the feature to get the value for.
 * @returns The raw string value of the feature flag, or `undefined` if not set.
 * @throws Error if config is not validated or feature name is invalid.
 */
export function getFeatureValue(feature: FeatureName): string | undefined {
	checkIsConfigValidated();

	if (!ALL_FEATURES.includes(feature)) {
		throw new Error(`Invalid feature name: ${feature}. Must be one of: ${ALL_FEATURES.join(', ')}`);
	}

	return import.meta.env[`VITE_FEATURE_${feature}`];
}

function validateFeatureConfig(): void {
	const errors: string[] = [];

	for (const feature of ALL_FEATURES) {
		const envVarName = `VITE_FEATURE_${feature}`;
		const envVarValue = import.meta.env[envVarName];

		if (envVarValue === undefined) {
			errors.push(`Undefined environment variable: ${envVarName}`);
			continue;
		}

		const normalizedValue = envVarValue.toLowerCase();
		if (normalizedValue.length < 1) {
			errors.push(`Empty environment variable: ${envVarName}`);
		}
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'));
	}
}

/**
 * Enum-like object containing all possible environment names.
 */
export const EnvironmentName = {
	PROD: 'PROD',
	DEMO: 'DEMO',
	DEV: 'DEV',
} as const;

export type EnvironmentName = typeof EnvironmentName[keyof typeof EnvironmentName];

/**
 * Gets the current environment name.
 * @returns The current environment name (PROD, DEMO, or DEV).
 * @throws Error if config is not validated.
 */
export function getEnvironmentName(): EnvironmentName {
	checkIsConfigValidated();

	return import.meta.env['VITE_ENVIRONMENT'] as EnvironmentName;
}

function validateEnvironmentConfig(): void {
	const envVar = import.meta.env['VITE_ENVIRONMENT'] as string | undefined;
	if (!envVar || !Object.values(EnvironmentName).includes(envVar as EnvironmentName)) {
		throw new Error(`Unknown environment: ${envVar}`);
	}
}

/**
 * Validates the application configuration including feature flags and environment settings.
 * Must be called before using any feature toggle functions.
 * In DEV environment, throws an error if validation fails.
 * In other environments, logs the error but continues execution.
 */
export function validateConfig(): void {
	if (!isConfigValidated) {
		try {
			validateFeatureConfig();
			validateEnvironmentConfig();
			isConfigValidated = true;
		} catch (error) {
			const logger = useLogger();
			logger.error('Configuration is not valid', { error: error as Error });

			if (getEnvironmentName() === EnvironmentName.DEV) {
				throw error;
			}
		}
	}
}
