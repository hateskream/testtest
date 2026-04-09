import { computed, onBeforeMount, ref, type Ref } from 'vue';

import { DominanceDateRange, getDefaultState, type IDisplaySettings, type IState } from '../model';
import { useQueryDominanceSnapshot } from '../queries';
import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';

interface IOptions {
	state: Ref<IState>;
}

export function useDominanceState({ state }: IOptions) {
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
		refetch,
		resetAllChanges,
	};
}
