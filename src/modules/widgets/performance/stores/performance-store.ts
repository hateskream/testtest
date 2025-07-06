import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
	INITIAL_PERFORMANCE_SETTINGS,
	PERFORMANCE_STOCK_TYPES,
	PERFORMANCE_TIME_RANGES,
	PERFORMANCE_DISPLAY_MODES,
} from '../const';
import type { IPerformanceSettings, IPerformanceFilter } from '../model';

export const usePerformanceStore = defineStore('performance', () => {
	// State
	const settings = ref<IPerformanceSettings>({ ...INITIAL_PERFORMANCE_SETTINGS });

	// Computed
	const filterTypes = computed(() => PERFORMANCE_STOCK_TYPES);
	const timeRanges = computed(() => PERFORMANCE_TIME_RANGES);
	const displayModes = computed(() => PERFORMANCE_DISPLAY_MODES);

	const currentFilter = computed(() => settings.value.filter);
	const currentDisplayMode = computed(() => settings.value.displayMode);
	const isCompactMode = computed(() => settings.value.compactMode);

	// Actions
	function setFilterType(type: IPerformanceFilter['type']) {
		settings.value.filter.type = type;
	}

	function setTimeRange(timeRange: IPerformanceFilter['timeRange']) {
		settings.value.filter.timeRange = timeRange;
	}

	function setDisplayMode(mode: IPerformanceSettings['displayMode']) {
		settings.value.displayMode = mode;
	}

	function toggleCompactMode() {
		settings.value.compactMode = !settings.value.compactMode;
	}

	function resetAll() {
		settings.value = { ...INITIAL_PERFORMANCE_SETTINGS };
	}

	return {
		// State
		settings,

		// Computed
		filterTypes,
		timeRanges,
		displayModes,
		currentFilter,
		currentDisplayMode,
		isCompactMode,

		// Actions
		setFilterType,
		setTimeRange,
		setDisplayMode,
		toggleCompactMode,
		resetAll,
	};
});
