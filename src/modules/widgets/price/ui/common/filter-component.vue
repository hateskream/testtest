<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketBadge, ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import type { MarketType } from '@/modules/market';
import { type FiltersState, type FiltersValues, FilterType, filterTypeToName, filterValueToDisplay } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();


interface IFilterComponentProps {
	filtersValues: FiltersValues;
	displayType: 'tv' | 'dashboard';
}

const props = defineProps<IFilterComponentProps>();

const activeMarket = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

const displayVariant = computed(() =>
	props.displayType === 'tv' ? 'default' : 'new',
);

function updateFilter(filterKey: FilterType, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: filterValue,
	};
}

const isTv = computed(()=>{
	return displayVariant.value === 'default';
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="displayVariant"
		@on-clear-click="emit('reset')"
	>
		<market-badge
			v-model="activeMarket"
			:display-variant="displayVariant"
			close-on-select
		/>
		<ui-delimiter v-if="isTv" />
		<modal-badge-filter
			v-for="(filterState, filterKey) in filters"
			:key="filterKey"
			:display-variant="displayVariant"
			:options="props.filtersValues[filterKey!]!"
			:selected-value="filterState"
			:label="filterValueToDisplay[filterState!].selected ?? filterValueToDisplay[filterState!].label"
			:title="filterTypeToName[filterKey]"
			close-on-select
			@select="updateFilter(filterKey, $event.value)"
		/>
	</widget-filters-scrollable>
</template>
