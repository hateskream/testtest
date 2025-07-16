import { WidgetType } from '../../widget';
import type { IPreset, PresetLayout } from './types';

const MAIN_DASHBOARD_PRESET_2: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_3: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_4: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_5: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_6: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_7: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_8: IPreset = {
	[WidgetType.Price]: { x: 0, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 3, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 3, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 2, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_9: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_10: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_11: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_12: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_13: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_14: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_15: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_16: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_17: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_18: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_19: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

const MAIN_DASHBOARD_PRESET_20: IPreset = {
	[WidgetType.Price]: { x: 0, y: 11, size: { w: 2, h: 3 } },
	[WidgetType.FearGreed]: { x: 2, y: 0, size: { w: 1, h: 3 } },
	[WidgetType.AltcoinSeason]: { x: 4, y: 0, size: { w: 2, h: 3 } },
	[WidgetType.Price2]: { x: 5, y: 0, size: { w: 3, h: 8 } },
	[WidgetType.News]: { x: 0, y: 53, size: { w: 2, h: 5 } },
	[WidgetType.Performance]: { x: 11, y: 3, size: { w: 3, h: 5 } },
	[WidgetType.Market]: { x: 0, y: 9, size: { w: 5, h: 5 } },
	[WidgetType.Watchlist]: { x: 5, y: 9, size: { w: 3, h: 5 } },
};

export const MAIN_DASHBOARD_PRESET: PresetLayout = {
	2: MAIN_DASHBOARD_PRESET_2,
	3: MAIN_DASHBOARD_PRESET_3,
	4: MAIN_DASHBOARD_PRESET_4,
	5: MAIN_DASHBOARD_PRESET_5,
	6: MAIN_DASHBOARD_PRESET_6,
	7: MAIN_DASHBOARD_PRESET_7,
	8: MAIN_DASHBOARD_PRESET_8,
	9: MAIN_DASHBOARD_PRESET_9,
	10: MAIN_DASHBOARD_PRESET_10,
	11: MAIN_DASHBOARD_PRESET_11,
	12: MAIN_DASHBOARD_PRESET_12,
	13: MAIN_DASHBOARD_PRESET_13,
	14: MAIN_DASHBOARD_PRESET_14,
	15: MAIN_DASHBOARD_PRESET_15,
	16: MAIN_DASHBOARD_PRESET_16,
	17: MAIN_DASHBOARD_PRESET_17,
	18: MAIN_DASHBOARD_PRESET_18,
	19: MAIN_DASHBOARD_PRESET_19,
	20: MAIN_DASHBOARD_PRESET_20,
};
