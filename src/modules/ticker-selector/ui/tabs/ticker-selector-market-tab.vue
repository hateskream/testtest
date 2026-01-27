<script setup lang="ts" generic="M extends readonly MarketType[]">
import { marketToName, MarketType } from '@/modules/market';
import { MARKET_TICKER_ITEMS_BY_MARKET, SelectionMode } from '../../model';
import { useTickerSelectorContext } from '@/modules/ticker-selector';

import TickerSelectorTitle from '../components/ticker-selector-title.vue';
import TickerSelectorIterator from '../components/ticker-selector-iterator.vue';
import TickerSelectorItem from '../components/ticker-selector-item.vue';
import TickerSelectorMarketItem from '../components/ticker-selector-market-item.vue';

const props = defineProps<{
	market: M[number];
	searchQuery: string;
	selectionMode: SelectionMode;
	isAllSelected: boolean;
	disableSelectAll: boolean;
	enableMarketTickers: boolean;
}>();

const emits = defineEmits<{
	exitTab: [];
}>();

const {
	selectMarket,
	unselectMarket,
	isTickerSelected,
	selectOrExcludeTickerToggle,
} = useTickerSelectorContext();
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.title">
			<ticker-selector-title
				:is-all-selected="props.isAllSelected"
				:disable-select-all="props.selectionMode === SelectionMode.Single || props.disableSelectAll"
				active
				@select-market="selectMarket(market)"
				@unselect-market="unselectMarket(market)"
				@click="emits('exitTab')"
			>
				{{marketToName[market]}}
			</ticker-selector-title>
		</div>

		<ticker-selector-iterator
			:market-type="props.market"
			:search-query="props.searchQuery"
		>
			<template v-if="props.enableMarketTickers" #before-tickers>
				<ticker-selector-market-item
					:market="MARKET_TICKER_ITEMS_BY_MARKET.get(props.market)!"
					:selection-mode="props.selectionMode"
					active
				/>
			</template>

			<template #default="{ticker}">
				<ticker-selector-item
					:ticker="ticker"
					:selection-mode="props.selectionMode"
					:active="isTickerSelected(props.market, ticker.canonical_ticker_id)"
					@click="selectOrExcludeTickerToggle(props.market, ticker)"
				/>
			</template>
		</ticker-selector-iterator>
	</div>
</template>

<style module="classes">
.wrapper {
	width: 100%;
}

.title {
	width: 100%;
	padding: 0 6px;
}
</style>
