export const ALL_FEATURES = [
	'DASHBOARD_PRESETS',
	'WIDGET_ALTCOIN_SEASON',
	'WIDGET_FEAR_GREED',
	'WIDGET_HOT_MARKETS',
	'WIDGET_MARKET',
	'WIDGET_MARKET_CAP',
	'WIDGET_NEWS',
	'WIDGET_PERFORMANCE',
	'WIDGET_PRICE_LIST',
	'WIDGET_WATCH_LIST',
] as const;

export type FeatureName = typeof ALL_FEATURES[number];

export function isFeatureEnabled(feature: FeatureName): boolean {
	const envVar = import.meta.env[`VITE_FEATURE_${feature}`] as string | undefined;
	return envVar?.toLowerCase() === 'true';
}
