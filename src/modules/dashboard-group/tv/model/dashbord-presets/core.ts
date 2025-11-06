/* eslint-disable @typescript-eslint/no-use-before-define */
import type { PresetLayout } from './types';
import { EnvironmentName, getEnvironmentName } from '@/shared/lib/feature-toggle';
import { CRYPTO_DASHBOARD_PRESET } from './crypto-preset';
import { STOCK_DASHBOARD_PRESET } from './stock-preset';
import { FOREX_DASHBOARD_PRESET } from './forex-preset';
export type PresetName = 'Crypto' | 'Stock' | 'Forex';

export const NAME_TO_PRESET = (): Record<PresetName, PresetLayout> => {
	const env = getEnvironmentName();

	switch (env) {
		case EnvironmentName.DEV:
			return createDevelopmentPreset;
		case EnvironmentName.DEMO:
			return createDemoPreset;
		case EnvironmentName.PROD:
			return createProductionPreset;
		default:
			throw new Error(`Unknown environment: ${env}`);
	}
};


const createProductionPreset: Record<PresetName, PresetLayout> = {
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};

const createDevelopmentPreset: Record<PresetName, PresetLayout> = {
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};

const createDemoPreset: Record<PresetName, PresetLayout> = {
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};
