<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed, reactive, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { TvModalDivider, UiModalSearch, UiModalWrapper } from '@/shared/ui/modal';
import { MarketType } from '@/modules/market';
import { UiPillItem, UiPillWrapper } from '@/shared/ui/pill';
import {
	type IMarketTickerItem,
	type ITickerItem,
	type ITickerSelectorEvents,
	SelectedSegment,
	SelectionMode,
} from '../model';
import { useInitTickerSelectorQuery, useTickerSelectorState } from '../composables';

import TickerSelectorSelectedTab from './tabs/ticker-selector-selected-tab.vue';
import TickerSelectorAllTab from './tabs/ticker-selector-all-tab.vue';
import TickerSelectorMarketTab from './tabs/ticker-selector-market-tab.vue';
import TickerSelectorInitSkeleton from './components/skeletons/ticker-selector-init-skeleton.vue';
import TickerSelectorError from './components/error/ticker-selector-error.vue';

const props = withDefaults(defineProps<{
	enabledMarkets: M;
	selectionMode: SelectionMode;
	displayVariant: 'new' | 'default';

	enableSelectAll?: boolean;
	enableMarketTickers?: boolean;

	searchPlaceholder?: string;
}>(), {
	enableSelectAll: false,
	enableMarketTickers: false,
	searchPlaceholder: 'Start typing the ticker...',
});

const selectedMarkets = defineModel<readonly M[number][]>('selectedMarkets', {
	default: () => [],
});

const selectedTickers = defineModel<ITickerItem[]>('selectedTickers', {
	default: () => [],
});

const excludedTickers = defineModel<ITickerItem[]>('excludedTickers', {
	default: () => [],
});

const selectedMarketTickers = defineModel<IMarketTickerItem[]>('selectedMarketTickers', {
	default: () => [],
});

const emit = defineEmits<{
	tickerSelected: [ticker: ITickerItem<M[number]>];
	tickerUnselected: [ticker: ITickerItem<M[number]>];
	tickerExcluded: [ticker: ITickerItem<M[number]>];
	tickerUnexcluded: [ticker: ITickerItem<M[number]>];
	marketSelected: [market: M[number]];
	marketUnselected: [market: M[number]];
	marketTickerSelected: [ticker: IMarketTickerItem<M[number]>];
	marketTickerUnselected: [ticker: IMarketTickerItem<M[number]>];
}>();

const events: ITickerSelectorEvents<M[number]> = {
	onTickerSelected: (ticker) => emit('tickerSelected', ticker),
	onTickerUnselected: (ticker) => emit('tickerUnselected', ticker),
	onTickerExcluded: (ticker) => emit('tickerExcluded', ticker),
	onTickerUnexcluded: (ticker) => emit('tickerUnexcluded', ticker),
	onMarketSelected: (market) => emit('marketSelected', market),
	onMarketUnselected: (market) => emit('marketUnselected', market),
	onMarketTickerSelected: (ticker) => emit('marketTickerSelected', ticker),
	onMarketTickerUnselected: (ticker) => emit('marketTickerUnselected', ticker),
};

const state = reactive(useTickerSelectorState({
	enabledMarkets: () => props.enabledMarkets,
	enableSelectAll: () => props.enableSelectAll,
	enableMarketTickers: () => props.enableMarketTickers,
	selectionMode: props.selectionMode,
	selectedMarkets: selectedMarkets,
	selectedTickers: selectedTickers,
	excludedTickers: excludedTickers,
	selectedMarketTickers: selectedMarketTickers,
	events,
}));

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

const { data, isLoading, isFetched, isError, refetch } = useInitTickerSelectorQuery();

const selectedSum = computed(() => {
	if (!data.value || props.selectionMode === SelectionMode.Single) {
		return 0;
	}

	let sum = 0;

	for (let i = 0; i < data.value.categories.length; i += 1) {
		const category = data.value.categories[i];
		const market = category.market_type;

		const isMarketSelected =
			state.selectedMarkets.includes(market);

		if (isMarketSelected) {
			sum += category.tickers_count;

			const excludedCount =
				state.excludedTickers.filter(
					t => t.market_type === market,
				).length;

			sum -= excludedCount;
			continue;
		}

		const selectedCount =
			state.selectedTickers.filter(
				t => t.market_type === market,
			).length;

		sum += selectedCount;

		const hasMarketTicker =
			state.selectedMarketTickers.some(
				t => t.market_type === market,
			);

		if (hasMarketTicker) {
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
			:placeholder="props.searchPlaceholder"
			autofocus
		/>

		<tv-modal-divider v-if="displayVariant === 'default'" />

		<template v-if="isLoading">
			<ticker-selector-init-skeleton
				:selection-mode="props.selectionMode"
			/>
		</template>

		<template v-else-if="isError">
			<ticker-selector-error @retry="refetch" />
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
