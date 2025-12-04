<script setup lang="ts">
import { computed } from 'vue';

import { type ITickerSelectAction, SymbolToName, type TickerDto } from '../../../model';
import { SymbolType } from '@/modules/cell';

import ModalFilterRow from './modal-filter-row.vue';
import ModalFilterRowTitle from './modal-filter-row-title.vue';
import ModalFilterEmptyState from './modal-filter-empty-state.vue';

interface IModalFilterListItemProps {
	group: SymbolType;
	tickers: TickerDto[];
	selectedTickerIds: string[];
	isSearching?: boolean;
	enableSelectAll?: boolean;
	displayVariant: 'new' | 'default';
}

const props = defineProps<IModalFilterListItemProps>();

interface IEmits {
	(e: 'select-group'): void;
	(e: 'select-all'): void;
	(e: 'toggle-select', action: ITickerSelectAction): void;
}

const emit = defineEmits<IEmits>();

const groupName = computed(() => SymbolToName[props.group]);

const isSelectedAll = computed(() => props.tickers.length === props.selectedTickerIds.length);

const searchedTickers = computed(() => props.tickers.slice(0, 3));
</script>

<template>
	<modal-filter-row-title
		:is-selected-all="isSelectedAll"
		:is-searching="props.isSearching"
		:is-inside-open="false"
		:enable-select-all="props.enableSelectAll"
		:display-variant
		@select-all="emit('select-all')"
		@click="emit('select-group')"
	>
		<template #title>{{ groupName }}</template>
		<template #count>{{ tickers.length }}</template>
	</modal-filter-row-title>
	<template v-if="props.isSearching">
		<modal-filter-empty-state v-if="props.tickers.length === 0">
			Nothing found in {{ groupName }}
		</modal-filter-empty-state>
		<modal-filter-row
			v-else
			:list="searchedTickers"
			:selected-ids-map="props.selectedTickerIds"
			:display-variant="props.displayVariant"
			@update="$emit('toggle-select', $event)"
		/>
	</template>
</template>
