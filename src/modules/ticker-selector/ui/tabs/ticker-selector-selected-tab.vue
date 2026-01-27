<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed, ref } from 'vue';

import { marketToName, type MarketType } from '@/modules/market';
import { useTickerSelectorContext, useTickerSelectorInfiniteQuery } from '../../composables';
import {
	type IMarketTickerItem,
	type ITickerItem,
	type SelectionMode,
} from '../../model';
import { UiModalContent, UiModalDivider } from '@/shared/ui/modal';

import TickerSelectorTitle from '../components/ticker-selector-title.vue';
import TickerSelectorItem from '../components/ticker-selector-item.vue';
import TickerSelectorEmpty from '../components/ticker-selector-empty.vue';
import TickerSelectorIterator from '../components/ticker-selector-iterator.vue';
import TickerSelectorItemsSkeleton from '../components/skeletons/ticker-selector-items-skeleton.vue';
import TickerSelectorMarketItem from '../components/ticker-selector-market-item.vue';

const props = defineProps<{
	markets: M;
	searchQuery: string;
	selectionMode: SelectionMode;
	selectedMarkets: readonly M[number][];
	excludedTickers: ITickerItem[];
	selectedTickers: ITickerItem[];
	selectedMarketTickers: IMarketTickerItem<M[number]>[];
	disableSelectAll: boolean;
	enableMarketTickers: boolean;
}>();

const emits = defineEmits<{
	selectMarketTab: [MarketType];
}>();

const localSelectedMarkets = ref<M[number][]>(
	[...props.selectedMarkets],
);

const localSelectedTickers = ref<ITickerItem[]>(
	[...props.selectedTickers],
);

const localSelectedMarketTickers = ref<IMarketTickerItem<M[number]>[]>(
	[...props.selectedMarketTickers],
);

const mappedTickers = computed(() => {
	const q = props.searchQuery.trim().toLowerCase();

	const result: [M[number], ITickerItem[]][] = [];

	for (const ticker of localSelectedTickers.value) {
		const market = ticker.market_type as M[number];

		let bucket = result.find(([m]) => m === market);

		if (!bucket) {
			bucket = [market, []];
			result.push(bucket);
		}

		if (
			!q ||
			ticker.symbol.toLowerCase().includes(q) ||
			ticker.name.toLowerCase().includes(q)
		) {
			bucket[1].push(ticker);
		}
	}

	return result.filter(([, tickers]) => tickers.length > 0);
});

const hasAnyTicker = computed(() =>
	mappedTickers.value.some(([, tickers]) => tickers.length > 0),
);

const {
	isMarketSelected,
	selectMarket,
	unselectMarket,
	isTickerSelected,
	selectOrExcludeTickerToggle,
} = useTickerSelectorContext();

const isMultipleMarketSearching = computed(
	() => !!props.searchQuery,
);

const { data, isFetching } = useTickerSelectorInfiniteQuery(() => ({
	page_size: 3,
	search_query: props.searchQuery,
	markets: Array.from(localSelectedMarkets.value) as unknown as MarketType[],
	// eslint-disable-next-line @typescript-eslint/naming-convention
	excluded_tickerIDs: props.excludedTickers.map(v => v.canonical_ticker_id),
}), () => ({
	enabled: isMultipleMarketSearching.value && localSelectedMarkets.value.length > 0,
}));

const searchTickerItems = computed(() => {
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

const selectedMarketTickerEntries = computed(() =>
	localSelectedMarketTickers.value.map(ticker => [
		ticker.market_type, ticker,
	] as [M[number], IMarketTickerItem<M[number]>]),
);

const searchedMarketTickers = computed(() => {
	const q = props.searchQuery.trim().toLowerCase();

	return selectedMarketTickerEntries.value.filter(([market, ticker]) => {
		if (props.selectedMarkets.includes(market)) {
			return false;
		}

		if (!q) {
			return true;
		}

		return ticker.label.toLowerCase().includes(q);
	});
});

const hasAny = computed(() => {
	if (localSelectedMarkets.value.length > 0) {
		return true;
	}

	if (localSelectedTickers.value.length > 0) {
		return true;
	}

	return localSelectedMarketTickers.value.length > 0;
});
</script>

<template>
	<template v-if="hasAny">
		<ui-modal-content v-if="props.markets.length > 1">
			<template
				v-for="market in localSelectedMarkets"
				:key="market"
			>
				<ticker-selector-title
					v-if="market"
					:active="isMultipleMarketSearching"
					:is-all-selected="isMarketSelected(market)"
					:disable-select-all="props.disableSelectAll"
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

					<template v-else-if="searchTickerItems && searchTickerItems[market].length > 0">
						<ticker-selector-item
							v-for="ticker in searchTickerItems[market]"
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

			<ui-modal-divider
				v-if="hasAnyTicker && localSelectedMarkets.length > 0 && searchedMarketTickers.length > 0"
			/>

			<template
				v-for="[marketType, marketTicker] in searchedMarketTickers"
				:key="marketType"
			>
				<ticker-selector-market-item
					v-if="marketType"
					:market="marketTicker"
					:selection-mode="props.selectionMode"
				/>
			</template>

			<template
				v-for="[marketType, tickers] in mappedTickers"
				:key="marketType"
			>
				<ticker-selector-item
					v-for="ticker in tickers"
					:key="ticker.canonical_ticker_id"
					:active="isTickerSelected(marketType, ticker.canonical_ticker_id)"
					:ticker="ticker"
					:selection-mode="props.selectionMode"
					@click="selectOrExcludeTickerToggle(marketType, ticker)"
				/>
			</template>
		</ui-modal-content>

		<ticker-selector-iterator
			v-else-if="isMarketSelected(props.markets[0])"
			:market-type="props.markets[0]"
			:search-query="props.searchQuery"
		>
			<template #default="{ticker}">
				<ticker-selector-item
					:ticker="ticker"
					:selection-mode="props.selectionMode"
					:active="isTickerSelected(props.markets[0], ticker.canonical_ticker_id)"
					@click="selectOrExcludeTickerToggle(props.markets[0], ticker)"
				/>
			</template>
		</ticker-selector-iterator>

		<ui-modal-content v-else-if="mappedTickers.length > 0">
			<template
				v-for="[marketType, tickers] in mappedTickers"
				:key="marketType"
			>
				<template v-if="props.enableMarketTickers">
					<template
						v-for="[, marketTicker] in searchedMarketTickers"
						:key="marketTicker"
					>
						<ticker-selector-market-item
							v-if="marketType"
							:market="marketTicker"
							:selection-mode="props.selectionMode"
						/>
					</template>
				</template>

				<ticker-selector-item
					v-for="ticker in tickers.values()"
					:key="ticker.canonical_ticker_id"
					:active="isTickerSelected(marketType, ticker.canonical_ticker_id)"
					:ticker="ticker"
					:selection-mode="props.selectionMode"
					@click="selectOrExcludeTickerToggle(marketType, ticker)"
				/>
			</template>
		</ui-modal-content>
	</template>

	<ticker-selector-empty v-else>
		Nothing was selected
	</ticker-selector-empty>
</template>

<style module="classes">
.title {
	width: 100%;
	margin-bottom: 2px;
	padding: 0 6px;
}
</style>
