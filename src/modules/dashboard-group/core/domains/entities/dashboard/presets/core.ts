import { MAIN_DASHBOARD_PRESET } from './main';
import { MAIN_PRODUCTION_DASHBOARD_PRESET } from './main-production';
import type { PresetLayout } from './types';

export type PresetName = 'Main' | 'MainProduction';

export const NAME_TO_PRESET: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
	MainProduction: MAIN_PRODUCTION_DASHBOARD_PRESET,
};
