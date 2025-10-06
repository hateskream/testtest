import { computed, reactive, ref, watch } from 'vue';
import z from 'zod';

import {
	displaySettings,
	getDefaultState,
	type IColorDepthSetting,
	type IMarketSettings,
	type ISingleSetting,
	type IState,
	TitleViewVariant,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const TitleViewVariantSchema = z.enum([
	TitleViewVariant.TICKER,
	TitleViewVariant.NAME,
	TitleViewVariant.NONE,
]);

export const DisplayStateSchemaC = z.object({
	sizeBy: z.string().optional(),
	groupBy: z.string().optional(),
	colorBy: z.string(),
	colorDepth: z.string(),
	displayValue: z.string(),
	isShowLogo: z.boolean(),
	titleSetting: TitleViewVariantSchema,
});

export const stateSchema = z.object({
	activeMarketId: z.string(),
	settings: z.record(z.string(), DisplayStateSchemaC),
});

export type StateSchemaType = z.infer<typeof stateSchema>;


const allMarkets = Object.values(displaySettings).map(({ market }) => ({ ...market }));

export function useHeatmap(widgetId: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__HEATMAP__',
		isSaveChange: true,
		getDefaultState: getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const {
		data: dataState,
		...rest
	} = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const marketSettings = ref<IMarketSettings>({
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

	const colorDepthSettings = ref<IColorDepthSetting>({
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
		allMarkets.find(m => m.id === marketSettings.value.active),
	);

	const activeDisplaySettings = computed(() => displaySettings[marketSettings.value.active]);

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
			colorBy.colorDepth.find(d => d.id === colorDepthSettings.value.active) ||
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
		() => state.value.settings[marketSettings.value.active],
		(activeSettings) => {
			if (!activeSettings) {
				return;
			}

			sizeBySettings.active = activeSettings.sizeBy || '';
			sizeBySettings.values = activeDisplaySettings.value.sizeBy || [];

			colorBySettings.active = activeSettings.colorBy || '';
			colorBySettings.values =
			activeDisplaySettings.value.colorBy.map(c => c.colorBy) || [];

			colorDepthSettings.value.active = activeSettings.colorDepth || '';
			colorDepthSettings.value.values =
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
			() => colorDepthSettings.value.active,
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
			const activeSettings = state.value.settings[marketSettings.value.active];
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

			colorDepthSettings.value.values = colorByOption.colorDepth;

			colorDepthSettings.value.active =
			colorByOption.colorDepth.find(d => d.id === colorDepthSettings.value.active)?.id ||
			(colorByOption.colorDepth[0]?.id ?? '');
		},
		{ immediate: true },
	);

	watch(
		() => marketSettings.value.active,
		(active) => {
			state.value.activeMarketId = active;
		},
	);


	watch(dataState, newState => {
		if (newState) {
			state.value.activeMarketId = newState.activeMarketId;
			marketSettings.value.active = newState.activeMarketId;
			state.value.settings = JSON.parse(JSON.stringify(newState.settings));
		}

	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultState();
	}

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

		resetAllChanges,
		...rest,
	};
}
