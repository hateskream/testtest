<script setup lang="ts">
import { ModalFilter } from './components/modal';
import { useQueryTickerSelector } from '../queries';
import type { ITickerEmits } from '../model';

const { data } = useQueryTickerSelector();

const selectedTickers = defineModel<string[]>({
	default: [],
});


const emits = defineEmits<ITickerEmits>();
</script>

<template>
	<modal-filter
		v-model="selectedTickers"
		:tickers="data!.tickers"
		@select="emits('select', $event)"
		@unselect="emits('unselect', $event)"
		@select-all="emits('selectAll', $event)"
	/>
</template>
