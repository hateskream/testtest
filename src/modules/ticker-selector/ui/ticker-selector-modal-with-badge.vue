<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed, useTemplateRef } from 'vue';

import { ModalBadgeDropdown } from '@/modules/widgets/base';
import { MarketType } from '@/modules/market';
import {
	TickerSelectorModal,
	type IMarketTickerItem,
	type ITickerItem,
	type SelectionModeType,
} from '@/modules/ticker-selector';

import ModalBadgePreview from './components/badge/modal-badge-preview.vue';

const props = withDefaults(defineProps<{
	enabledMarkets: M;
	selectionMode: SelectionModeType;
	enableSelectAll?: boolean;
	enableMarketTickers?: boolean;

	displayVariant: 'new' | 'default';
	showLabel?: boolean;
	showIcon?: boolean;
	closeOnSelect?: boolean;
}>(), {
	enableMarketTickers: false,
	showLabel: true,
	showIcon: true,
});

const searchQuery = defineModel<string>('search-query', {
	default: '',
});
const selectedMarkets = defineModel<M>('selected-markets', {
	default: [],
});
const selectedTickers = defineModel<ITickerItem[]>('selected-tickers', {
	default: [],
});
const excludedTickers = defineModel<ITickerItem[]>('excluded-tickers', {
	default: [],
});
const selectedMarketTickers = defineModel<IMarketTickerItem<M[number]>[]>('selected-market-tickers', {
	default: [],
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

const paddingLeft = computed(() => {
	if (!props.showIcon || props.displayVariant === 'default') {
		return undefined;
	}

	const isHasMarketTicker = props.enableMarketTickers
		? !!selectedMarketTickers.value.length : false;

	return selectedTickers.value.length || isHasMarketTicker ? '4px' : undefined;
});

const dropdownRef = useTemplateRef('dropdown');

function closeDropdown() {
	dropdownRef.value?.close();
}

function onChanged() {
	if (props.closeOnSelect && props.selectionMode === 'single') {
		closeDropdown();
	}
}
</script>

<template>
	<modal-badge-dropdown
		ref="dropdown"
		:display-variant="props.displayVariant"
		:padding-left="paddingLeft"
	>
		<template #title>
			<modal-badge-preview
				:selected-tickers="selectedTickers"
				:selected-markets="selectedMarkets"
				:excluded-tickers="excludedTickers"
				:selected-market-tickers="selectedMarketTickers"
				:display-variant="props.displayVariant"
				:show-icon="props.showIcon"
				:show-label="props.showLabel"
			/>
		</template>

		<template #content>
			<ticker-selector-modal
				v-model:search-query="searchQuery"
				v-model:selected-markets="selectedMarkets"
				v-model:excluded-tickers="excludedTickers"
				v-model:selected-tickers="selectedTickers"
				v-model:selected-market-tickers="selectedMarketTickers"
				:enable-market-tickers="props.enableMarketTickers"
				:selection-mode="props.selectionMode"
				:enable-select-all="props.enableSelectAll"
				:enabled-markets="props.enabledMarkets"
				:display-variant="props.displayVariant"
				@update:selected-tickers="onChanged"
				@ticker-selected="emit('tickerSelected', $event)"
				@ticker-unselected="emit('tickerUnselected', $event)"
				@ticker-excluded="emit('tickerExcluded', $event)"
				@ticker-unexcluded="emit('tickerUnexcluded', $event)"
				@market-selected="emit('marketSelected', $event)"
				@market-unselected="emit('marketUnselected', $event)"
				@market-ticker-selected="emit('marketTickerSelected', $event)"
				@market-ticker-unselected="emit('marketTickerUnselected', $event)"
			/>
		</template>
	</modal-badge-dropdown>
</template>

<style scoped>

</style>
