<script setup lang="ts">
import { type TickerDto } from '@/modules/ticker-selector/model/filter-ticker';
import { SymbolType } from '@/modules/cell';

import ModalFilterListItem from './modal-filter-list-item.vue';
import ModalFilterScrollable from './modal-filter-scrollable.vue';

interface IModalFilterListProps {
	groupedTickers: Record<SymbolType, TickerDto[]>;
	groupedSelectedTickerIds: Record<SymbolType, string[]>;
	isSearching?: boolean;
	enableSelectAll?: boolean;
	displayVariant: 'new' | 'default';
}

const props = defineProps<IModalFilterListProps>();

interface IEmits {
	(e: 'select-group', group: SymbolType): void;
	(e: 'select-all', group: SymbolType): void;
}

const emit = defineEmits<IEmits>();
</script>

<template>
	<modal-filter-scrollable>
		<modal-filter-list-item
			v-for="(tickers, group) in groupedTickers"
			:key="group"
			:group="group"
			:tickers="tickers"
			:selected-ticker-ids="groupedSelectedTickerIds[group]"
			:display-variant="props.displayVariant"
			:is-searching="props.isSearching"
			:enable-select-all="props.enableSelectAll"
			@select-all="emit('select-all', group)"
			@select-group="emit('select-group', group)"
		/>
	</modal-filter-scrollable>
</template>
