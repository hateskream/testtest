/* eslint-disable @typescript-eslint/no-use-before-define */
import type { PresetLayout } from './types';
import { EnvironmentName, getEnvironmentName } from '@/shared/lib/feature-toggle';
import { MAIN_DASHBOARD_PRESET } from './main';
import { MAIN_PRODUCTION_DASHBOARD_PRESET } from './main-production';
import { CRYPTO_DASHBOARD_PRESET } from './crypto-preset';
import { STOCK_DASHBOARD_PRESET } from './stock-preset';
import { FOREX_DASHBOARD_PRESET } from './forex-preset';
export type PresetName = 'Main' | 'Crypto' | 'Stock' | 'Forex';

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
	Main: MAIN_PRODUCTION_DASHBOARD_PRESET,
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};

const createDevelopmentPreset: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};

const createDemoPreset: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
	Crypto: CRYPTO_DASHBOARD_PRESET,
	Stock: STOCK_DASHBOARD_PRESET,
	Forex: FOREX_DASHBOARD_PRESET,
};
