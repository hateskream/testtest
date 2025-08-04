import { computed, reactive, ref, watch, type Ref } from 'vue';
import { useUrlSearchParams } from '@vueuse/core';

import {
	TitleViewVariant,
	type IColorBy,
	type IColorDepthSetting,
	type IDisplaySettings,
	type IMarketSettings,
	type ISingleSetting,
} from '../model';

interface IParams {
	market?: string | undefined;
	sizeBy?: string | undefined;
	colorBy?: string | undefined;
	colorDepth?: string | undefined;
	displayValue?: string | undefined;
	showLogo?: string | undefined;
	title?: string | undefined;
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

	const defaultTitleViewVariant = TitleViewVariant.NAME;
	const titleSetting = ref<TitleViewVariant>(defaultTitleViewVariant);

	const defaultShowLogo = true;
	const isShowLogo = ref(defaultShowLogo);

	const activeMarket = computed(() => marketSettings.markets.find(m => m.id === marketSettings.active));

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
		if (!setting || !setting.sizeBy) {
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

	const activeDisplayValue = computed(() => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return null;
		}
		return setting.displayValue.find(d => d.key === displayValueSettings.active) || setting.displayValue[0];
	});

	onCreated();

	watch(settings, newSettings => {
		if (!newSettings?.length) {
			return;
		}

		marketSettings.markets = newSettings.map(s => s.market);

		const initialMarket = params.market && newSettings.some(s => s.market.id === params.market)
			? params.market
			: newSettings[0].market.id;

		marketSettings.active = initialMarket;
	});

	let isInit = false;

	watch(() => marketSettings.active, () => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return;
		}

		if (setting.sizeBy) {
			sizeBySettings.values = setting.sizeBy;
		}

		const defaultMarket = settings.value![0].market.id;
		setParamIfNotDefault('market', marketSettings.active, defaultMarket);

		colorBySettings.values = setting.colorBy.map(c => c.colorBy);
		displayValueSettings.values = setting.displayValue;


		if (!isInit) {
			if (setting.sizeBy) {
				sizeBySettings.active = initActive(params.sizeBy, setting.sizeBy, s => s.key);
			}

			colorBySettings.active = initActive(params.colorBy, setting.colorBy, c => c.colorBy.key);

			colorDepthSettings.values = activeColorBy.value!.colorDepth;
			colorDepthSettings.active = initActive(params.colorDepth, activeColorBy.value!.colorDepth, d => d.id);

			displayValueSettings.active = initActive(params.displayValue, setting.displayValue, d => d.key);

			isInit = true;
			return;
		} else {
			params.sizeBy = undefined;
			params.colorBy = undefined;
			params.colorDepth = undefined;
			params.displayValue = undefined;
		}
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
		if (!setting || !setting.sizeBy) {
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

	watch(isShowLogo, logo => {
		setParamIfNotDefault('showLogo', String(logo), String(defaultShowLogo));
	});

	watch(titleSetting, title => {
		setParamIfNotDefault('title', title, defaultTitleViewVariant);
	});

	function initActive<T>(param: string | undefined, values: T[], getKey: (item: T) => string): string {
		const defaultValue = getKey(values[0]);
		const active = param && values.some(v => getKey(v) === param) ? param : defaultValue;
		return active;
	}

	function setParamIfNotDefault(paramKey: keyof IParams, value: string, defaultValue: string) {
		params[paramKey] = value !== defaultValue ? value : undefined;
	}

	function onCreated() {
		const { showLogo, title } = params;

		if (showLogo) {
			isShowLogo.value = showLogo === 'true';
		}

		if (title) {
			titleSetting.value = title as TitleViewVariant;
		}
	}

	return {
		marketSettings,
		activeMarket,
		sizeBySettings,
		colorBySettings,
		colorDepthSettings,
		displayValueSettings,
		activeColorBy,
		activeSizeBy,
		activeColorDepth,
		isShowLogo,
		titleSetting,
		activeDisplayValue,
	};
}
