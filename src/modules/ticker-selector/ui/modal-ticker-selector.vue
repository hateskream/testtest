<script setup lang="ts">
import { ModalFilter } from './components/modal';
import { useQueryTickerSelector } from '../queries';
import type { ITickerEmits } from '../model';

interface IProps {
	isBackgroundTransparent?: boolean;
	enableSelectedInfo?: boolean;
	enableSelectAll?: boolean;
	textAboveSearch?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	isBackgroundTransparent: false,
	enableSelectedInfo: true,
	enableSelectAll: true,
	textAboveSearch: '',
});

const { data } = useQueryTickerSelector();

const selectedTickers = defineModel<string[]>({
	default: [],
});


const emits = defineEmits<ITickerEmits>();
</script>

<template>
	<modal-filter
		v-if="data?.tickers"
		v-model="selectedTickers"
		:tickers="data.tickers"
		:is-background-transparent="props.isBackgroundTransparent"
		:enable-selected-info="props.enableSelectedInfo"
		:enable-select-all="props.enableSelectAll"
		:text-above-search="props.textAboveSearch"
		@select="emits('select', $event)"
		@unselect="emits('unselect', $event)"
		@select-all="emits('selectAll', $event)"
	/>
</template>
