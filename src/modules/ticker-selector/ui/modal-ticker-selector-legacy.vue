<script setup lang="ts">
import { ModalFilter } from './components/modal';
import { useQueryTickerSelector } from '../queries';
import type { ITickerEmits } from '../model';
import { MarketType } from '@/modules/market';

interface IProps {
	/**
	 * Show "All" and "Selected" tabs before options
	 */
	enableSelectedInfo?: boolean;

	/**
	 * Enable to select all options in group
	 */
	enableSelectAll?: boolean;

	/**
	 * @default multiple
	 */
	selectionMode?: 'single' | 'multiple';

	/**
	 * @default Start typing the ticker...
	 */
	searchPlaceholder?: string;

	/**
	 * Enable markets selection using v-model:markets (crypto, stock, forex, etc..)
	 */
	enableMarkets?: boolean;

	/**
	 * Available market types for selection
	 * @example [MarketType.Crypto, MarketType.Stock]
	 * @default Object.values(MarketType)
	 */
	marketTypes?: MarketType[];

	/**
	 * Change from "Selected" tab to "All" when selected tickers are empty
	 */
	closeEmptySelected?: boolean;

	isBackgroundTransparent?: boolean;
	displayVariant: 'new' | 'default';
	textAboveSearch?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	isBackgroundTransparent: false,
	enableSelectedInfo: true,
	enableSelectAll: true,
	textAboveSearch: '',
	selectionMode: 'multiple',
	searchPlaceholder: 'Start typing the ticker...',
	marketTypes: () => Object.values(MarketType),
});

const { data } = useQueryTickerSelector();

const selectedTickers = defineModel<string[]>({ default: () => [] });
const selectedMarkets = defineModel<MarketType[]>('markets', { default: () => [] });

const emit = defineEmits<ITickerEmits>();
</script>

<template>
	<modal-filter
		v-if="data?.tickers"
		v-model="selectedTickers"
		v-model:markets="selectedMarkets"
		:tickers="data.tickers"
		:selection-mode="props.selectionMode"
		:is-background-transparent="props.isBackgroundTransparent"
		:enable-selected-info="props.enableSelectedInfo"
		:enable-select-all="props.enableSelectAll"
		:enable-markets="props.enableMarkets"
		:text-above-search="props.textAboveSearch"
		:search-placeholder="props.searchPlaceholder"
		:market-types="props.marketTypes"
		:display-variant="props.displayVariant"
		:close-empty-selected="props.closeEmptySelected"
		@select="emit('select', $event)"
		@unselect="emit('unselect', $event)"
		@select-all="emit('selectAll', $event)"
	/>
</template>
