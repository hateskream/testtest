<script setup lang="ts">
import { ModalBadgeList } from '@/modules/widgets/base';
import { type FiltersDefinition, type FiltersState, type IFilterState } from '../model';

import FilterModalSubmenu from '@/modules/screener/base/ui/filter/filter-modal-submenu.vue';

const filters = defineModel<FiltersState>('filters', { required: true });

interface IScreenerFiltersProps {
	definitions: FiltersDefinition;
}

const props = defineProps<IScreenerFiltersProps>();

function updateFilter(key: string, state: IFilterState) {
	filters.value = {
		...filters.value,
		[key]: state,
	};
}
</script>
<template>
	<modal-badge-list display-variant="new">
		<template #title>Filters</template>
		<filter-modal-submenu
			v-for="(filter, key) in props.definitions"
			:key="key"
			:config="filter"
			:model-value="filters[key]"
			@update:model-value="updateFilter(key, $event)"
		/>
	</modal-badge-list>
</template>

<style module="classes">

</style>
