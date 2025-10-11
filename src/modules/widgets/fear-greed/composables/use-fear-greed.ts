import { computed, ref, watch } from 'vue';
import z from 'zod';

import { useQueryTension } from '../queries';
import { getDefaultViewState, type ISettings } from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const settingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowName: z.boolean(),
	isShowDescription: z.boolean(),
	isShowPastValues: z.boolean(),
});

type ISettingsSchema = z.infer<typeof settingsSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useFearGreed({ widgetId, isEphemeral }: IOptions) {
	const viewState = ref<ISettings>(getDefaultViewState());

	const { data, isLoading, isError, refetch } = useQueryTension();

	const {
		useStateQuery,
		useStateMutation,
		undo,
		redo,
	} = createStateQueries<ISettings, ISettingsSchema>({
		storageKey: '__FEAR_GREED__',
		isSaveChange: !isEphemeral,
		getDefaultState: getDefaultViewState,
		entityId: widgetId,
		schema: settingsSchema,
		hydrateFn: (s: ISettingsSchema): ISettings => s,
		rehydrateFn: (s: ISettings): ISettingsSchema => s,
		urlGet: '',
		urlSet: '',
	});

	const {
		data: dataSettings,
		isLoading: isLoadingSettings,
	} = useStateQuery();
	const { mutate } = useStateMutation();

	const dataState = computed(() => ({
		data: data.value,
		isLoading: isLoading.value,
		isError: isError.value,
	}));

	const isNotData = computed(() => isLoading.value && !isLoadingSettings.value);

	watch(dataSettings, newSettings => {
		if (newSettings) {
			viewState.value = { ...newSettings };
		}

	}, { immediate: true });

	watch(viewState, newSettings => {
		if (JSON.stringify(newSettings) === JSON.stringify(dataSettings.value)) {
			return;
		}
		mutate(newSettings);
	}, { deep: true });


	function resetAllChanges() {
		viewState.value = getDefaultViewState();
	}

	return {
		viewState,
		dataState,
		isNotData,

		resetAllChanges,
		refetch,

		undo,
		redo,
	};
}
