<script setup lang="ts">
import { computed } from 'vue';

import { MarketType } from '@/modules/market';
import {
	type IMarketTickerItem,
	type ITickerItem, MARKET_TICKER_ITEMS,
	MARKET_TICKER_ITEMS_BY_MARKET,
	SelectionMode,
} from '@/modules/ticker-selector';
import { dateRangeFilters, dateRangeFilterValueToDisplay, MarketCapDateRange, type MarketCapType } from '../../model';
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { UiDelimiter } from '@/shared/ui/delimiter';

import TickerSelectorModalWithBadge from '@/modules/ticker-selector/new/ticker-selector-modal-with-badge.vue';

const emit = defineEmits<{
	reset: [];
}>();

const selectedTickers = defineModel<string[]>('selectedTickers', { required: true });
const selectedMarkets = defineModel<MarketCapType[]>('selectedMarkets', { required: true });
const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

interface IMarketCapFiltersPanelProps {
	isShowDateRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IMarketCapFiltersPanelProps>();

const selectedRangeLabel = computed(() => dateRangeFilterValueToDisplay[activeDateRange.value].selected);

function onTickerSelect(newTickers: ITickerItem[]) {
	selectedTickers.value = newTickers.map(v => v.canonical_ticker_id);
}

function onMarketTickerSelect(
	newMarketTickers: IMarketTickerItem<MarketType.Crypto | MarketType.Stock>[],
) {
	selectedMarkets.value = newMarketTickers.map(v => v.market_type);
}

const marketTickers = computed(() => {
	if (selectedMarkets.value.length === 0) {
		return [MARKET_TICKER_ITEMS[0]] as IMarketTickerItem<MarketCapType>[];
	}

	return selectedMarkets.value.map(
		v => MARKET_TICKER_ITEMS_BY_MARKET.get(v)!,
	) as IMarketTickerItem<MarketCapType>[];
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<ticker-selector-modal-with-badge
			:selected-market-tickers="marketTickers"
			:enabled-markets="[MarketType.Crypto, MarketType.Stock]"
			:display-variant="props.displayVariant"
			:selection-mode="SelectionMode.Multiple"
			show-icon
			show-label
			autofocus
			enable-market-tickers
			@update:selected-tickers="onTickerSelect"
			@update:selected-market-tickers="onMarketTickerSelect"
		/>
		<template v-if="props.isShowDateRange">
			<ui-delimiter v-if="props.displayVariant === 'default'" />
			<modal-badge-filter
				:display-variant="props.displayVariant"
				:options="dateRangeFilters"
				:selected-value="activeDateRange"
				:label="selectedRangeLabel"
				close-on-select
				title="Date"
				@select="activeDateRange = $event.value"
			/>
		</template>
	</widget-filters-scrollable>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
}
</style>
