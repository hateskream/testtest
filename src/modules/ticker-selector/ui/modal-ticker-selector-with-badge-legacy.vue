<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { ModalFilter } from './components/modal';
import { useQueryTickerSelector } from '../queries';
import { ACTIVE_TICKER_LIST_COUNT_SHOW, getMappedMarket, getMappedRow, type ITickerEmits } from '../model';
import { ModalBadgeDropdown } from '@/modules/widgets/base';
import { MarketType } from '@/modules/market';

import ModalBadgePreview from '@/modules/ticker-selector/ui/components/modal/modal-badge-preview.vue';

interface IProps {
	/**
	 * @default multiple
	 */
	selectionMode?: 'single' | 'multiple';

	/**
	 * Show "All" and "Selected" tabs before options
	 */
	enableSelectedInfo?: boolean;

	/**
	 * Enable markets selection using v-model:markets (crypto, stock, forex, etc..)
	 */
	enableMarkets?: boolean;

	/**
	 * Enable to select all options in group
	 */
	enableSelectAll?: boolean;

	/**
	 * @default default
	 */
	displayVariant?: 'default' | 'new';

	/**
	 * @default Start typing the ticker...
	 */
	searchPlaceholder?: string;

	/**
	 * Available market types for selection
	 * @example [MarketType.Crypto, MarketType.Stock]
	 * @default Object.values(MarketType)
	 */
	marketTypes?: MarketType[];

	/**
	 * Focus search input on open modal
	 */
	autofocus?: boolean;

	/**
	 * Show selected option label in badge
	 */
	showLabel?: boolean;

	/**
	 * Show selected option icon in badge
	 */
	showIcon?: boolean;

	/**
	 * Change from "Selected" tab to "All" when selected tickers are empty
	 */
	closeEmptySelected?: boolean;

	/**
	 * Close modal on select
	 */
	closeOnSelect?: boolean;

	isBackgroundTransparent?: boolean;
	textAboveSearch?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	selectionMode: 'multiple',
	enableSelectedInfo: true,
	displayVariant: 'default',
	searchPlaceholder: 'Start typing the ticker...',
	textAboveSearch: '',
	marketTypes: () => Object.values(MarketType),
	showIcon: true,
});

const selectedTickers = defineModel<string[]>({ default: () => [] });
const selectedMarkets = defineModel<MarketType[]>('markets', { default: () => [] });

const { data } = useQueryTickerSelector();

const emit = defineEmits<ITickerEmits>();

const selectedTickersMapped = computed(() => {
	return (data.value?.tickers ?? [])
		.filter((item) => selectedTickers.value.includes(item.tickerId))
		.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)
		.map(getMappedRow);
});

const selectedMarketsMapped = computed(() => {
	return selectedMarkets.value
		.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW - selectedTickersMapped.value.length)
		.map(getMappedMarket);
});

const badgeDropdownRef = useTemplateRef('badgeDropdown');

function close() {
	badgeDropdownRef.value?.close?.();
}

function onSelect(item: string) {
	emit('select', item);

	if (props.closeOnSelect) {
		close();
	}
}

function onUnselect(item: string) {
	emit('unselect', item);
}
</script>

<template>
	<modal-badge-dropdown
		ref="badgeDropdown"
		:padding-left="selectedTickers.length && props.displayVariant !== 'default' ? `4px` : undefined"
		:display-variant="props.displayVariant"
	>
		<template #title>
			<modal-badge-preview
				:selected-tickers="selectedTickersMapped"
				:selected-markets="selectedMarketsMapped"
				:total-selected-count="selectedTickers.length + selectedMarkets.length"
				:display-variant="props.displayVariant"
				:show-label="props.showLabel"
				:show-icon="props.showIcon"
				:market-types="props.marketTypes"
			/>
		</template>
		<template #content>

			<modal-filter
				v-if="data"
				v-model="selectedTickers"
				v-model:markets="selectedMarkets"
				:selection-mode="props.selectionMode"
				:tickers="data.tickers"
				:enable-selected-info="props.enableSelectedInfo"
				:enable-markets="props.enableMarkets"
				:enable-select-all="props.enableSelectAll"
				:search-placeholder="props.searchPlaceholder"
				:market-types="props.marketTypes"
				:display-variant="displayVariant"
				:autofocus="props.autofocus"
				:close-empty-selected="props.closeEmptySelected"
				:is-background-transparent="props.isBackgroundTransparent"
				:text-above-search="props.textAboveSearch"
				@select="onSelect"
				@unselect="onUnselect"
				@select-all="emit('selectAll', $event)"
			/>
		</template>
	</modal-badge-dropdown>
</template>
