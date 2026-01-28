import { computed, onBeforeMount, ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import {
	DominanceDateRange,
	getDefaultState,
	type IDisplaySettings,
	type IState,
	stateSchema,
	type StateSchemaType,
} from '../model';
import { useQueryDominanceSnapshot } from '../queries';
import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import { deepCompare } from '@/shared/lib/compare';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useDominance({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__DOMINANCE__',
		isSaveChange: !isEphemeral,
		getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();

	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const _selectedTickers = ref<ITickerItem[]>([]);

	onBeforeMount(async () => {
		_selectedTickers.value = await fetchTickers(state.value.selectedTickers);
	});

	const selectedTickers = computed({
		get: () => _selectedTickers.value,
		set: (val: ITickerItem[]) => {
			_selectedTickers.value = val;

			state.value.selectedTickers = val.map(v => v.canonical_ticker_id);
		},
	});

	const activeDateRange = computed({
		get: () => state.value.dateRange,
		set: (val: DominanceDateRange) => {
			state.value.dateRange = val;
		},
	});

	const displaySettings = computed({
		get: () => state.value.displaySettings,
		set: (val: IDisplaySettings) => {
			state.value.displaySettings = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
		}
	}, { immediate: true });

	watch(state, (newState) => {
		if (deepCompare(newState, state.value)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	async function resetAllChanges() {
		state.value = getDefaultState();
		_selectedTickers.value = await fetchTickers(state.value.selectedTickers);
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryDominanceSnapshot(() => selectedTickers.value.map(v => v.canonical_ticker_id));

	return {
		selectedTickers,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
	};
}
