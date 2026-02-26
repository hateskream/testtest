<script setup lang="ts">
import { computed } from 'vue';

import { MarketType } from '@/modules/market';
import {
	type IMarketTickerItem,
	type ITickerItem,
	MARKET_TICKER_ITEMS,
	MARKET_TICKER_ITEMS_BY_MARKET,
	SelectionMode,
	TickerSelectorModalWithBadge,
} from '@/modules/ticker-selector';
import { dateRangeFilters, type MarketCapType } from '../../model';
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	createPreset,
	type DateRangePresetType,
	type DateRangeValue,
	getDateRangePresetLabel,
} from '@/modules/lightweight-charts/model';

const emit = defineEmits<{
	reset: [];
}>();

const selectedTickers = defineModel<ITickerItem[]>('selectedTickers', { required: true });
const selectedMarkets = defineModel<MarketCapType[]>('selectedMarkets', { required: true });
const activeDateRange = defineModel<DateRangeValue>('dateRange', { required: true });

interface IMarketCapFiltersPanelProps {
	isShowDateRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IMarketCapFiltersPanelProps>();

const selectedDateRangeLabel = computed(() => {
	const range = activeDateRange.value;

	if (range.type === 'preset') {
		return getDateRangePresetLabel(range.preset);
	}

	return 'Custom range';
});

const selectedDateRangePreset = computed(() => {
	if (!activeDateRange.value) {
		return undefined;
	}

	if (activeDateRange.value.type === 'preset') {
		return activeDateRange.value.preset;
	}

	return undefined;
});

function selectDateRange(preset: DateRangePresetType) {
	activeDateRange.value = createPreset(preset);
}

const marketTickers = computed({
	get: () => {
		if (selectedMarkets.value.length === 0) {
			return [MARKET_TICKER_ITEMS[0]] as IMarketTickerItem<MarketCapType>[];
		}

		return selectedMarkets.value.map(
			v => MARKET_TICKER_ITEMS_BY_MARKET.get(v)!,
		) as IMarketTickerItem<MarketCapType>[];
	},
	set: (newMarketTickers: IMarketTickerItem<MarketType.Crypto | MarketType.Stock>[]) => {
		selectedMarkets.value = newMarketTickers.map(v => v.market_type);
	},
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<ticker-selector-modal-with-badge
			v-model:selected-tickers="selectedTickers"
			v-model:selected-market-tickers="marketTickers"
			:enabled-markets="[MarketType.Crypto, MarketType.Stock]"
			:display-variant="props.displayVariant"
			:selection-mode="SelectionMode.Multiple"
			show-icon
			show-label
			autofocus
			enable-market-tickers
		/>
		<template v-if="props.isShowDateRange">
			<ui-delimiter v-if="props.displayVariant === 'default'" />
			<modal-badge-filter
				:display-variant="props.displayVariant"
				:options="dateRangeFilters"
				:selected-value="selectedDateRangePreset"
				:label="selectedDateRangeLabel"
				close-on-select
				title="Date"
				@select="selectDateRange($event.value)"
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
