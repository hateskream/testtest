<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed, reactive, type Ref, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { TvModalDivider, UiModalSearch, UiModalWrapper } from '@/shared/ui/modal';
import { MarketType } from '@/modules/market';
import { UiPillItem, UiPillWrapper } from '@/shared/ui/pill';
import {
	arrayToTickerMap,
	createSelectedMarketTickersMap,
	flattenSelectedMarketTickersMap,
	type IMarketTickerItem,
	type ITickerItem,
	mapToTickerArray,
	SelectedSegment,
	SelectionMode,
} from '../model';
import { useInitTickerSelectorQuery, useTickerSelectorState } from '../composables';

import TickerSelectorSelectedTab from './tabs/ticker-selector-selected-tab.vue';
import TickerSelectorAllTab from './tabs/ticker-selector-all-tab.vue';
import TickerSelectorMarketTab from './tabs/ticker-selector-market-tab.vue';
import TickerSelectorInitSkeleton from './components/skeletons/ticker-selector-init-skeleton.vue';

const props = defineProps<{
	enabledMarkets: M;
	selectionMode: SelectionMode;
	enableSelectAll?: boolean;
	enableMarketTickers?: boolean;

	displayVariant: 'new' | 'default';

	selectedMarkets?: M;
	selectedTickers?: ITickerItem[];
	excludedTickers?: ITickerItem[];
	selectedMarketTickers?: IMarketTickerItem[];
}>();

const emit = defineEmits<{
	'update:selectedMarkets': [readonly M[number][]];
	'update:selectedTickers': [ITickerItem[]];
	'update:excludedTickers': [ITickerItem[]];
	'update:selectedMarketTickers': [IMarketTickerItem[]];
	changed: [];
}>();

const localSelectedMarkets = ref(
	new Set<M[number]>(props.selectedMarkets ?? []),
) as Ref<Set<M[number]>>;

const localSelectedTickers = ref(
	arrayToTickerMap(props.selectedTickers ?? [], props.enabledMarkets),
);

const localExcludedTickers = ref(
	arrayToTickerMap(props.excludedTickers ?? [], props.enabledMarkets),
);

const localSelectedMarketTickers = ref(
	createSelectedMarketTickersMap(props.selectedMarketTickers ?? []),
);

const state = reactive(useTickerSelectorState({
	enabledMarkets: () => props.enabledMarkets,
	enableSelectAll: () => props.enableSelectAll,
	enableMarketTickers: () => props.enableMarketTickers,
	selectionMode: props.selectionMode,

	selectedMarkets: localSelectedMarkets,
	selectedTickers: localSelectedTickers,
	excludedTickers: localExcludedTickers,

	selectedMarketTickers: localSelectedMarketTickers,
}));

watch(localSelectedMarkets, v => {
	emit('update:selectedMarkets', Array.from(v));
	emit('changed');
}, { deep: true });

watch(localSelectedTickers, v => {
	emit('update:selectedTickers', mapToTickerArray(v));
	emit('changed');
}, { deep: true });

watch(localExcludedTickers, v => {
	emit('update:excludedTickers', mapToTickerArray(v));
	emit('changed');
}, { deep: true });

watch(localSelectedMarketTickers, v => {
	emit('update:selectedMarketTickers', flattenSelectedMarketTickersMap(v));
	emit('changed');
}, { deep: true });

const _searchQueryModel = defineModel<string>('searchQuery', {
	required: false,
	default: '',
});

const updateDebounced = useDebounceFn((v: string) => {
	_searchQueryModel.value = v;
}, 400);

const searchQuery = computed({
	get: () => _searchQueryModel.value ?? '',
	set: v => updateDebounced(v),
});

const selectedSegment = ref<SelectedSegment>(SelectedSegment.All);

const selectedMarketTab = ref<M[number] | null>(null);

function selectSegment(segment: SelectedSegment) {
	selectedSegment.value = segment;
	selectedMarketTab.value = null;
}

function selectMarketTab(market: M[number]) {
	selectedMarketTab.value = market;
	selectedSegment.value = SelectedSegment.All;
}

function exitMarketTab() {
	selectedMarketTab.value = null;
	selectedSegment.value = SelectedSegment.All;
}

const { data, isLoading, isFetched, isError } = useInitTickerSelectorQuery();

const selectedSum = computed(() => {
	if (!data.value || props.selectionMode === SelectionMode.Single) {
		return 0;
	}

	let sum = 0;

	for (let i = 0; i < data.value.categories.length; i+=1) {
		const category = data.value.categories[i];
		const market = category.market_type;

		if (state.selectedMarkets.has(category.market_type)) {
			sum += category.tickers_count;

			const excluded = state.excludedTickers.get(market);

			if (excluded) {
				sum -= excluded.size;
			}

			continue;
		}

		const tickers = state.selectedTickers.get(market);
		if (tickers) {
			sum += tickers.size;
		}

		const marketTickers = state.selectedMarketTickers.get(market);
		if (marketTickers) {
			sum += 1;
		}
	}

	return sum;
});
</script>

<template>
	<ui-modal-wrapper
		:class="classes.tickerSelector"
		:display-variant="displayVariant"
	>
		<ui-modal-search
			v-model="searchQuery"
			placeholder="Start typing the ticker..."
			autofocus
		/>

		<tv-modal-divider v-if="displayVariant === 'default'" />

		<template v-if="isLoading">
			<ticker-selector-init-skeleton
				:selection-mode="props.selectionMode"
			/>
		</template>

		<template v-else-if="isError">
			Error
		</template>

		<template v-else-if="data && isFetched">
			<ui-pill-wrapper v-if="props.selectionMode !== SelectionMode.Single">
				<ui-pill-item
					:model-value="selectedSegment === SelectedSegment.All"
					@click="selectSegment(SelectedSegment.All)"
				>
					<span>All Tickers</span>
					<span>·</span>
					<span>{{data.total_available}}</span>
				</ui-pill-item>
				<ui-pill-item
					:model-value="selectedSegment === SelectedSegment.Selected"
					@click="selectSegment(SelectedSegment.Selected)"
				>
					<span>Selected</span>
					<span>·</span>
					<span>{{selectedSum}}</span>
				</ui-pill-item>
			</ui-pill-wrapper>

			<template v-if="selectedMarketTab">
				<ticker-selector-market-tab
					:style="{
						paddingTop: props.selectionMode === SelectionMode.Single ? '6px' : undefined
					}"
					:market="selectedMarketTab"
					:search-query="searchQuery"
					:selection-mode="props.selectionMode"
					:is-all-selected="state.isMarketSelected(selectedMarketTab)"
					:disable-select-all="!props.enableSelectAll"
					:enable-market-tickers="props.enableMarketTickers"
					@exit-tab="exitMarketTab"
				/>
			</template>

			<template v-else>
				<ticker-selector-all-tab
					v-if="selectedSegment === SelectedSegment.All"
					:search-query="searchQuery"
					:markets="props.enabledMarkets"
					:selection-mode="props.selectionMode"
					:selected-markets="state.selectedMarkets"
					:disable-select-all="!props.enableSelectAll"
					:enable-market-tickers="props.enableMarketTickers"
					@select-market-tab="selectMarketTab"
				/>

				<ticker-selector-selected-tab
					v-else
					:markets="props.enabledMarkets"
					:search-query="searchQuery"
					:selection-mode="props.selectionMode"
					:selected-markets="state.selectedMarkets"
					:excluded-tickers="state.excludedTickers"
					:selected-tickers="state.selectedTickers"
					:selected-market-tickers="state.selectedMarketTickers"
					:disable-select-all="!props.enableSelectAll"
					:enable-market-tickers="props.enableMarketTickers"
					@select-market-tab="selectMarketTab"
				/>
			</template>
		</template>
	</ui-modal-wrapper>
</template>

<style module="classes">
.tickerSelector {
	position: relative;
	width: 312px;
	max-height: min(600px, 80svh);
	overflow: hidden;
}
</style>
