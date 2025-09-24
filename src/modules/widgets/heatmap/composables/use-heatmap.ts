import { computed, reactive, ref, watch } from 'vue';

import {
	displaySettings,
	getDefaultState,
	TitleViewVariant,
	type IColorDepthSetting,
	type IMarketSettings,
	type ISingleSetting,
	type IState,
} from '../model';

const allMarkets = Object.values(displaySettings).map(({ market }) => ({ ...market }));

export function useHeatmap() {
	const state = ref<IState>(getDefaultState());

	const marketSettings = reactive<IMarketSettings>({
		active: state.value.activeMarketId,
		markets: allMarkets,
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

	const groupBySettings = reactive<ISingleSetting>({
		active: '',
		values: [],
	});

	const isShowLogo = ref(true);
	const titleSetting = ref<TitleViewVariant>(TitleViewVariant.NAME);

	const activeMarket = computed(() =>
		allMarkets.find(m => m.id === marketSettings.active),
	);

	const activeDisplaySettings = computed(() => displaySettings[marketSettings.active]);

	const activeSizeBy = computed(() =>
		activeDisplaySettings.value.sizeBy?.find(s => s.key === sizeBySettings.active) || null,
	);

	const activeColorBy = computed(() => {
		const setting = activeDisplaySettings.value;
		if (!setting) {
			return null;
		}

		return (
			setting.colorBy.find(c => c.colorBy.key === colorBySettings.active) ||
		setting.colorBy[0] ||
		null
		);
	});

	const activeColorDepth = computed(() => {
		const colorBy = activeColorBy.value;
		if (!colorBy) {
			return null;
		}

		return (
			colorBy.colorDepth.find(d => d.id === colorDepthSettings.active) ||
		colorBy.colorDepth[0] ||
		null
		);
	});

	const activeDisplayValue = computed(() =>
		activeDisplaySettings.value.displayValue.find(d => d.key === displayValueSettings.active) || null,
	);

	const activeGroupBy = computed(() =>
		activeDisplaySettings.value.groupBy?.find(g => g.key === groupBySettings.active) || null,
	);

	watch(
		() => state.value.settings[marketSettings.active],
		(activeSettings) => {
			if (!activeSettings) {
				return;
			}

			sizeBySettings.active = activeSettings.sizeBy || '';
			sizeBySettings.values = activeDisplaySettings.value.sizeBy || [];

			colorBySettings.active = activeSettings.colorBy || '';
			colorBySettings.values =
			activeDisplaySettings.value.colorBy.map(c => c.colorBy) || [];

			colorDepthSettings.active = activeSettings.colorDepth || '';
			colorDepthSettings.values =
			activeDisplaySettings.value.colorBy.find(c => c.colorBy.key === colorBySettings.active)?.colorDepth || [];

			displayValueSettings.active = activeSettings.displayValue || '';
			displayValueSettings.values = activeDisplaySettings.value.displayValue || [];

			groupBySettings.active = activeSettings.groupBy || '';
			groupBySettings.values = activeDisplaySettings.value.groupBy || [];

			isShowLogo.value = activeSettings.isShowLogo;
			titleSetting.value = activeSettings.titleSetting;
		},
		{ immediate: true },
	);

	watch(
		[
			() => sizeBySettings.active,
			() => colorBySettings.active,
			() => colorDepthSettings.active,
			() => displayValueSettings.active,
			() => groupBySettings.active,
			() => isShowLogo.value,
			() => titleSetting.value,
		],
		([
			sizeBy,
			colorBy,
			colorDepth,
			displayValue,
			groupBy,
			isLogo,
			title,
		]) => {
			const activeSettings = state.value.settings[marketSettings.active];
			if (!activeSettings) {
				return;
			}

			activeSettings.sizeBy = sizeBy;
			activeSettings.colorBy = colorBy;
			activeSettings.colorDepth = colorDepth;
			activeSettings.displayValue = displayValue;
			activeSettings.groupBy = groupBy;
			activeSettings.isShowLogo = isLogo;
			activeSettings.titleSetting = title;
		},
		{ immediate: true },
	);

	watch(
		() => colorBySettings.active,
		(active) => {
			const setting = activeDisplaySettings.value;
			if (!setting) {
				return;
			}

			const colorByOption = setting.colorBy.find(c => c.colorBy.key === active);
			if (!colorByOption) {
				return;
			}

			colorDepthSettings.values = colorByOption.colorDepth;

			colorDepthSettings.active =
			colorByOption.colorDepth.find(d => d.id === colorDepthSettings.active)?.id ||
			(colorByOption.colorDepth[0]?.id ?? '');
		},
		{ immediate: true },
	);

	return {
		marketSettings,
		sizeBySettings,
		colorBySettings,
		colorDepthSettings,
		displayValueSettings,
		groupBySettings,
		isShowLogo,
		titleSetting,

		activeMarket,
		activeColorBy,
		activeSizeBy,
		activeColorDepth,
		activeDisplayValue,
		activeGroupBy,
	};
}
