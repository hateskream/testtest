<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed } from 'vue';

import { marketToName, type MarketType } from '@/modules/market';
import { useTickerSelectorContext, useTickerSelectorInfiniteQuery } from '../../composables';
import { UiModalContent } from '@/shared/ui/modal';
import {
	type ITickerItem,
	type SelectionModeType,
	MARKET_TICKER_ITEMS_BY_MARKET,
	SelectionMode,
} from '@/modules/ticker-selector';

import TickerSelectorTitle from '../components/ticker-selector-title.vue';
import TickerSelectorIterator from '../components/ticker-selector-iterator.vue';
import TickerSelectorItem from '../components/ticker-selector-item.vue';
import TickerSelectorEmpty from '../components/ticker-selector-empty.vue';
import TickerSelectorItemsSkeleton from '../components/skeletons/ticker-selector-items-skeleton.vue';
import TickerSelectorMarketItem from '../components/ticker-selector-market-item.vue';

const props = defineProps<{
	markets: M;
	searchQuery: string;
	selectionMode: SelectionModeType;
	selectedMarkets: readonly M[number][];
	disableSelectAll: boolean;
	enableMarketTickers: boolean;
}>();

const emits = defineEmits<{
	selectMarketTab: [M[number]];
}>();

const {
	isMarketSelected,
	selectMarket,
	unselectMarket,
	isTickerSelected,
	selectOrExcludeTickerToggle,
} = useTickerSelectorContext();

const firstMarket = computed(() =>
	props.markets[0] || null,
);

const isMultipleMarketSearching = computed(
	() => !!props.searchQuery && props.markets.length > 1,
);

const { data, isFetching } = useTickerSelectorInfiniteQuery(() => ({
	page_size: 3,
	search_query: props.searchQuery,
	markets: props.markets as unknown as MarketType[],
}), () => ({
	enabled: isMultipleMarketSearching.value,
}));

const items = computed(() => {
	if (!data.value) {
		return null;
	}

	const result = {} as Record<MarketType, ITickerItem[]>;

	for (const page of data.value.pages ?? []) {
		for (const category of page.categories) {
			const market = category.market_type;

			(result[market] ??= []).push(...category.tickers);
		}
	}

	return result;
});
</script>

<template>
	<ui-modal-content v-if="props.markets.length > 1">
		<template
			v-for="market in props.markets"
			:key="market"
		>
			<ticker-selector-title
				:active="isMultipleMarketSearching"
				:is-all-selected="isMarketSelected(market)"
				:disable-select-all="props.selectionMode === SelectionMode.Single || props.disableSelectAll"
				@click="emits('selectMarketTab', market)"
				@select-market="selectMarket(market)"
				@unselect-market="unselectMarket(market)"
			>
				{{marketToName[market]}}
			</ticker-selector-title>

			<template v-if="isMultipleMarketSearching">
				<template v-if="isFetching">
					<ticker-selector-items-skeleton />
				</template>

				<template v-else-if="items && items[market].length > 0">
					<ticker-selector-item
						v-for="ticker in items[market]"
						:key="ticker.canonical_ticker_id"
						:ticker="ticker"
						:selection-mode="props.selectionMode"
						:active="isTickerSelected(market, ticker.canonical_ticker_id)"
						@click="selectOrExcludeTickerToggle(market, ticker)"
					/>
				</template>

				<template v-else>
					<ticker-selector-empty>
						Nothing found in {{market}}
					</ticker-selector-empty>
				</template>
			</template>
		</template>
	</ui-modal-content>

	<template v-else-if="firstMarket">
		<div v-if="props.selectionMode === SelectionMode.Single || !props.disableSelectAll" :class="classes.title">
			<ticker-selector-title
				active
				:is-all-selected="isMarketSelected(firstMarket)"
				:disable-select-all="props.selectionMode === SelectionMode.Single || props.disableSelectAll"
				@select-market="selectMarket(firstMarket)"
				@unselect-market="unselectMarket(firstMarket)"
			>
				{{marketToName[markets[0]]}}
			</ticker-selector-title>
		</div>

		<ticker-selector-iterator
			:market-type="firstMarket"
			:search-query="props.searchQuery"
		>
			<template v-if="props.enableMarketTickers" #before-tickers>
				<ticker-selector-market-item
					:market="MARKET_TICKER_ITEMS_BY_MARKET.get(firstMarket)!"
					:selection-mode="props.selectionMode"
					active
				/>
			</template>

			<template #default="{ticker}">
				<ticker-selector-item
					:ticker="ticker"
					:selection-mode="props.selectionMode"
					:active="isTickerSelected(firstMarket, ticker.canonical_ticker_id)"
					@click="selectOrExcludeTickerToggle(firstMarket, ticker)"
				/>
			</template>
		</ticker-selector-iterator>
	</template>

	<ticker-selector-empty v-else>
		No markets enabled
	</ticker-selector-empty>
</template>

<style module="classes">
.title {
	width: 100%;
	margin-bottom: 2px;
	padding: 6px 6px 0;
}
</style>
