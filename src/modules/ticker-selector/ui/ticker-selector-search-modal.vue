<script setup lang="ts" generic="M extends MarketType[]">
import { computed, reactive, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { UiModalSearch, UiModalWrapper } from '@/shared/ui/modal';
import { marketToName, MarketType } from '@/modules/market';
import {
	type IMarketTickerItem,
	type ITickerCategory,
	type ITickerItem,
	type ITickerSelectorEvents,
	SelectionMode,
} from '../model';
import { useInitTickerSelectorQuery, useTickerSelectorInfiniteQuery, useTickerSelectorState } from '../composables';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import type { IInitTickerSelectorCategory } from '@/modules/ticker-selector/api';

import TickerSelectorInitSkeleton from './components/skeletons/ticker-selector-init-skeleton.vue';
import TickerSelectorError from './components/error/ticker-selector-error.vue';
import TickerSelectorItem from '@/modules/ticker-selector/ui/components/ticker-selector-item.vue';
import TickerSelectorIterator from '@/modules/ticker-selector/ui/components/ticker-selector-iterator.vue';

const props = withDefaults(defineProps<{
	enabledMarkets: M;
	searchPlaceholder?: string;
}>(), {
	searchPlaceholder: 'Start typing the ticker...',
});

const selectedMarkets = defineModel<M[number][]>('selectedMarkets', {
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

const emits = defineEmits<{
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
	onTickerSelected: (ticker) => emits('tickerSelected', ticker),
	onTickerUnselected: (ticker) => emits('tickerUnselected', ticker),
	onTickerExcluded: (ticker) => emits('tickerExcluded', ticker),
	onTickerUnexcluded: (ticker) => emits('tickerUnexcluded', ticker),
	onMarketSelected: (market) => emits('marketSelected', market),
	onMarketUnselected: (market) => emits('marketUnselected', market),
	onMarketTickerSelected: (ticker) => emits('marketTickerSelected', ticker),
	onMarketTickerUnselected: (ticker) => emits('marketTickerUnselected', ticker),
};

const state = reactive(useTickerSelectorState({
	enabledMarkets: () => props.enabledMarkets,
	enableSelectAll: false,
	enableMarketTickers: false,
	selectionMode: SelectionMode.Single,
	selectedMarkets: selectedMarkets,
	selectedTickers: selectedTickers,
	excludedTickers: excludedTickers,
	selectedMarketTickers: selectedMarketTickers,
	events: events,
}));

const searchQueryModel = defineModel<string>('searchQuery', {
	required: false,
	default: '',
});

const updateDebounced = useDebounceFn((v: string) => {
	searchQueryModel.value = v;
}, 400);

const searchQuery = computed({
	get: () => searchQueryModel.value ?? '',
	set: v => updateDebounced(v),
});

const selectedMarketTab = ref<M[number]>(props.enabledMarkets[0]);

const { data, isLoading, isFetched, isError, refetch } = useInitTickerSelectorQuery();

const { data: tickers } = useTickerSelectorInfiniteQuery(() => ({
	search_query: searchQuery.value,
	markets: props.enabledMarkets,
}), { keepPreviousData: true });

const preparedMarkets = computed(() => {
	if (!data.value) {
		return [];
	}

	const isSearch = searchQuery.value.length > 0 && tickers.value?.pages?.length;

	const categories = isSearch
		? tickers.value?.pages?.[0]?.categories ?? []
		: data.value.categories;

	const totalsByMarket = Object.fromEntries(
		categories.map(category => {
			return [category.market_type, isSearch
				? (category as ITickerCategory).ticker_count
				: (category as IInitTickerSelectorCategory).tickers_count];
		}),
	);

	return props.enabledMarkets
		.map(market => ({
			market,
			label: marketToName[market],
			total: totalsByMarket[market] ?? 0,
		}))
		.sort((a, b) => Number(a.total === 0) - Number(b.total === 0));
});
</script>

<template>
	<ui-modal-wrapper :class="classes.tickerSelector" display-variant="new">
		<ui-modal-search
			v-model="searchQuery"
			:placeholder="props.searchPlaceholder"
			autofocus
		/>
		<ticker-selector-init-skeleton v-if="isLoading" selection-mode="single" />
		<ticker-selector-error v-else-if="isError" @retry="refetch" />

		<template v-else-if="data && isFetched">
			<ui-scrollable-row :class="classes.scrollableRow">
				<ui-segmented-control v-model="selectedMarketTab" :class="classes.segmentedControl">
					<ui-segmented-control-item
						v-for="market in preparedMarkets"
						:key="market.market"
						:value="market.market"
					>
						<span>{{ market.label }}</span>
						<span>·</span>
						<span>{{ market.total }}</span>
					</ui-segmented-control-item>
				</ui-segmented-control>
			</ui-scrollable-row>
			<ticker-selector-iterator
				:market-type="selectedMarketTab"
				:search-query="searchQuery"
				max-height="unset"
			>
				<template #default="{ ticker }">
					<ticker-selector-item
						:ticker="ticker"
						selection-mode="single"
						:active="state.isTickerSelected(selectedMarketTab, ticker.canonical_ticker_id)"
						@click="state.selectOrExcludeTickerToggle(selectedMarketTab, ticker)"
					/>
				</template>
			</ticker-selector-iterator>
		</template>
	</ui-modal-wrapper>
</template>

<style module="classes">
.tickerSelector {
	position: relative;
	width: 312px;
	overflow: hidden;
}

.scrollableRow {
	flex-shrink: 0;
	padding: var(--padding-s6, 10px) 0 4px;
}

.segmentedControl {
	padding: 0 var(--padding-s10, 18px);
}
</style>
