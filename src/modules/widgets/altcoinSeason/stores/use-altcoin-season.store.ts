import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';

import type { IAltcoinSeasonConfig, IAltcoinSeasonRequest, AltcoinSeasonModuleKey } from '../model';
import { useQueryAltcoinSeasonWidgetConfig, useQueryAltcoinSeason } from '../queries';
import { updateAltcoinSeasonWidgetConfig } from '../api';
import { useLogger } from '@/shared/service/logger';

export const useAltcoinSeasonStore = defineStore('altcoinSeasonWidget', () => {
	const logger = useLogger();
	const request = ref<IAltcoinSeasonRequest>({ market: 'crypto' });

	const altcoinSeasonWidgetConfig = ref<IAltcoinSeasonConfig>();
	const isSaving = ref(false);
	const saveError = ref<string | null>(null);

	const configQuery = useQueryAltcoinSeasonWidgetConfig(request.value);
	const dataQuery = useQueryAltcoinSeason(request.value);

	const config = computed(() => {
		return altcoinSeasonWidgetConfig.value || configQuery.data.value;
	});

	const modules = computed(() => config.value?.modules || {});
	const period = computed(() => config.value?.period || '90D');

	const isConfigLoading = computed(() => configQuery.isLoading.value);
	const isDataLoading = computed(() => dataQuery.isLoading.value);
	const isLoading = computed(() => isConfigLoading.value || isDataLoading.value || isSaving.value);

	function setRequest(newRequest: IAltcoinSeasonRequest) {
		request.value = newRequest;
	}

	async function saveConfig(newConfig: IAltcoinSeasonConfig) {
		if (isSaving.value) {
			return;
		}

		isSaving.value = true;
		saveError.value = null;

		try {
			await updateAltcoinSeasonWidgetConfig(request.value, newConfig);
			logger.info('Config saved successfully');
		} catch (error) {
			saveError.value = error instanceof Error ? error.message : 'Failed to save config';
			logger.error('Failed to save config', error as Error);
			throw error;
		} finally {
			isSaving.value = false;
		}
	}

	async function toggleModule(moduleKey: AltcoinSeasonModuleKey) {
		if (!config.value) {
			return;
		}

		const previousConfig = { ...config.value };

		// Optimistic update
		const newConfig: IAltcoinSeasonConfig = {
			...config.value,
			modules: {
				...config.value.modules,
				[moduleKey]: !config.value.modules[moduleKey],
			},
		};

		altcoinSeasonWidgetConfig.value = newConfig;

		try {
			await saveConfig(newConfig);
		} catch (error) {
			// Откат изменений при ошибке
			altcoinSeasonWidgetConfig.value = previousConfig;
			logger.error('Failed to toggle module, reverting changes', error as Error);
		}
	}

	async function setModuleState(moduleKey: AltcoinSeasonModuleKey, enabled: boolean) {
		if (!config.value) {
			return;
		}

		const previousConfig = { ...config.value };

		// Optimistic update
		const newConfig: IAltcoinSeasonConfig = {
			...config.value,
			modules: {
				...config.value.modules,
				[moduleKey]: enabled,
			},
		};

		altcoinSeasonWidgetConfig.value = newConfig;

		try {
			await saveConfig(newConfig);
		} catch (error) {
			// Откат изменений при ошибке
			altcoinSeasonWidgetConfig.value = previousConfig;
			logger.error('Failed to set module state, reverting changes', error as Error);
		}
	}

	async function setPeriod(newPeriod: IAltcoinSeasonConfig['period']) {
		if (!config.value) {
			return;
		}

		const previousConfig = { ...config.value };

		// Optimistic update
		const newConfig: IAltcoinSeasonConfig = {
			...config.value,
			period: newPeriod,
		};

		altcoinSeasonWidgetConfig.value = newConfig;

		try {
			await saveConfig(newConfig);
		} catch (error) {
			// Откат изменений при ошибке
			altcoinSeasonWidgetConfig.value = previousConfig;
			logger.error('Failed to set period, reverting changes', error as Error);
		}
	}

	function resetConfigToDefault() {
		altcoinSeasonWidgetConfig.value = undefined;
		configQuery.refetch();
	}

	// Инициализация конфига из запроса при первой загрузке
	function initializeConfig() {
		if (configQuery.data.value && !altcoinSeasonWidgetConfig.value) {
			altcoinSeasonWidgetConfig.value = { ...configQuery.data.value };
		}
	}

	return {
		request,
		config,
		modules,
		period,

		isConfigLoading,
		isDataLoading,
		isLoading,
		isSaving,
		saveError,

		setRequest,
		toggleModule,
		setModuleState,
		setPeriod,
		resetConfigToDefault,
		initializeConfig,
		saveConfig,

		configQuery,
		dataQuery,
	};
});
