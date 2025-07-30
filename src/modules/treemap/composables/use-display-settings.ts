import { computed, reactive, watch, type Ref } from 'vue';
import { useUrlSearchParams } from '@vueuse/core';

import type {
	IColorBy,
	IColorDepthSetting,
	IDisplaySettings,
	IMarketSettings,
	ISingleSetting,
} from '../model';

interface IParams {
	market?: string | undefined;
	sizeBy?: string | undefined;
	colorBy?: string | undefined;
	colorDepth?: string | undefined;
	displayValue?: string | undefined;
}

export function useDisplaySettings(settings: Ref<IDisplaySettings[] | null | undefined>) {
	const params = useUrlSearchParams<IParams>('history');

	const marketSettings = reactive<IMarketSettings>({
		active: '',
		markets: [],
	});

	const sizeBySettings = reactive<ISingleSetting>({
		active: '',
		values: [],
	});

	const colorBySettings = reactive<ISingleSetting>({
		active: '',
		values: [],
	});

	const colorDepthSettings = reactive<IColorDepthSetting>({
		active: '',
		values: [],
	});

	const displayValueSettings = reactive<ISingleSetting>({
		active: '',
		values: [],
	});

	const activeDisplaySettings = computed(() => {
		if (!settings.value?.length) {
			return null;
		}
		return settings.value.find(s => s.market.id === marketSettings.active) || settings.value[0];
	});

	const activeColorBy = computed((): IColorBy | null => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return null;
		}
		return setting.colorBy.find(c => c.colorBy.key === colorBySettings.active) || setting.colorBy[0];
	});

	const activeSizeBy = computed(() => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return null;
		}
		return setting.sizeBy.find(s => s.key === sizeBySettings.active) || setting.sizeBy[0];
	});

	const activeColorDepth = computed(() => {
		const setting = activeColorBy.value;
		if (!setting) {
			return null;
		}
		return setting.colorDepth.find(c => c.id === colorDepthSettings.active) || setting.colorDepth[0];
	});

	watch(settings, newSettings => {
		if (!newSettings?.length) {
			return;
		}

		marketSettings.markets = newSettings.map(s => s.market);

		const initialMarket = params.market && newSettings.some(s => s.market.id === params.market)
			? params.market
			: newSettings[0].market.id;

		marketSettings.active = initialMarket;
	}, { immediate: true });

	watch(() => marketSettings.active, () => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return;
		}

		sizeBySettings.values = setting.sizeBy;
		colorBySettings.values = setting.colorBy.map(c => c.colorBy);
		displayValueSettings.values = setting.displayValue;

		const defaultMarket = settings.value![0].market.id;
		setParamIfNotDefault('market', marketSettings.active, defaultMarket);

		params.sizeBy = undefined;
		params.colorBy = undefined;
		params.colorDepth = undefined;
		params.displayValue = undefined;

		sizeBySettings.active = initActive(params.sizeBy, setting.sizeBy, s => s.key);
		colorBySettings.active = initActive(params.colorBy, setting.colorBy, c => c.colorBy.key);

		colorDepthSettings.values = activeColorBy.value!.colorDepth;
		colorDepthSettings.active = initActive(params.colorDepth, activeColorBy.value!.colorDepth, d => d.id);

		displayValueSettings.active = initActive(params.displayValue, setting.displayValue, d => d.key);
	});

	watch(() => colorBySettings.active, () => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return;
		}

		const colorByOption = setting.colorBy.find(c => c.colorBy.key === colorBySettings.active);
		if (!colorByOption) {
			return;
		}

		colorDepthSettings.values = colorByOption.colorDepth;
		colorDepthSettings.active = initActive(params.colorDepth, colorByOption.colorDepth, d => d.id);

		setParamIfNotDefault('colorBy', colorBySettings.active, setting.colorBy[0].colorBy.key);
	});

	watch(() => sizeBySettings.active, (active) => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return;
		}
		setParamIfNotDefault('sizeBy', active, setting.sizeBy[0].key);
	});

	watch(() => colorDepthSettings.active, (active) => {
		const colorBy = activeColorBy.value;
		if (!colorBy) {
			return;
		}
		setParamIfNotDefault('colorDepth', active, colorBy.colorDepth[0].id);
	});

	watch(() => displayValueSettings.active, (active) => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return;
		}
		setParamIfNotDefault('displayValue', active, setting.displayValue[0].key);
	});

	function setParamIfNotDefault(paramKey: keyof IParams, value: string, defaultValue: string) {
		params[paramKey] = value !== defaultValue ? value : undefined;
	}

	function initActive<T>(param: string | undefined, values: T[], getKey: (item: T) => string): string {
		const defaultValue = getKey(values[0]);
		const active = param && values.some(v => getKey(v) === param) ? param : defaultValue;
		return active;
	}

	return {
		marketSettings,
		sizeBySettings,
		colorBySettings,
		colorDepthSettings,
		displayValueSettings,
		activeColorBy,
		activeSizeBy,
		activeColorDepth,
	};
}
