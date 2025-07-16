import { MAIN_DASHBOARD_PRESET } from './main';
import type { PresetLayout } from './types';

export type PresetName = 'Main';

export const NAME_TO_PRESET: Record<PresetName, PresetLayout> = {
	Main: MAIN_DASHBOARD_PRESET,
};
