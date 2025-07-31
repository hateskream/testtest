let isConfigValidated = false;

function checkIsConfigValidated() {
	if (!isConfigValidated) {
		throw new Error('Config is not validated');
	}
}

const ALL_WIDGETS = [
	'WIDGET_ALTCOIN_SEASON',
	'WIDGET_FEAR_GREED',
	'WIDGET_HOT_MARKETS',
	'WIDGET_MARKET',
	'WIDGET_MARKET_CAP',
	'WIDGET_NEWS',
	'WIDGET_PERFORMANCE',
	'WIDGET_PRICE_LIST',
	'WIDGET_WATCH_LIST',
	'WIDGET_BITCOIN_DOMINANC',
] as const;

export type WidgetFeature = typeof ALL_WIDGETS[number];

export const ALL_FEATURES = [
	'DASHBOARD_PRESETS',
	...ALL_WIDGETS,
] as const;

export type FeatureName = typeof ALL_FEATURES[number];

export function isFeatureEnabled(feature: FeatureName): boolean {
	checkIsConfigValidated();

	if (!ALL_FEATURES.includes(feature)) {
		throw new Error(`Invalid feature name: ${feature}. Must be one of: ${ALL_FEATURES.join(', ')}`);
	}

	const envVar = import.meta.env[`VITE_FEATURE_${feature}`] as string;
	return envVar.toLowerCase() === 'true';
}

export function getAllEnableWidgets(): WidgetFeature[] {
	return ALL_WIDGETS.filter(feature => isFeatureEnabled(feature));
}

function validateFeatureConfig(): void {
	const errors: string[] = [];

	for (const feature of ALL_FEATURES) {
		const envVarName = `VITE_FEATURE_${feature}`;
		const envVarValue = import.meta.env[envVarName];

		if (envVarValue === undefined) {
			errors.push(`Missing environment variable: ${envVarName}`);
			continue;
		}

		const normalizedValue = envVarValue.toLowerCase();
		if (normalizedValue !== 'true' && normalizedValue !== 'false') {
			errors.push(`Invalid value for ${envVarName}: expected 'true' or 'false', got '${envVarValue}'`);
		}
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'));
	}
}

export const EnvironmentName = {
	PROD: 'PROD',
	DEMO: 'DEMO',
	DEV: 'DEV',
} as const;

export type EnvironmentName = typeof EnvironmentName[keyof typeof EnvironmentName];

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

export function validateConfig(): void {
	if (!isConfigValidated) {
		validateFeatureConfig();
		validateEnvironmentConfig();
		isConfigValidated = true;
	}
}

