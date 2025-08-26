/* eslint-disable @typescript-eslint/no-use-before-define */
import { EnvironmentName, getEnvironmentName } from '@/shared/lib/feature-toggle';
import { MAIN_DASHBOARD_PRESET } from './main';
import { MAIN_PRODUCTION_DASHBOARD_PRESET } from './main-production';
import type { PresetLayout } from './types';

export type PresetName = 'Main';

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
};

const createDevelopmentPreset: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
};

const createDemoPreset: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
};
