<script setup lang="ts">
import { computed, watch } from 'vue';

import { useScreener } from '../composables';
import { type FilterCondition, ScreenerType } from '../model';
import { ScreenerFiltersComponent } from '../ui';
import { UiSkeletonGroup } from '@/shared/ui/skeleton';
import { useQueryScreener } from '@/modules/screener/base/queries/use-query-screener.ts';

import ScreenerTableComponent from '@/modules/screener/base/ui/screener-table-component.vue';

const props = defineProps<{
	type: ScreenerType;
}>();

const {
	columns,
	activeSort,
	activeScreenerType,
	filtersState,
	filtersDefinitions,
} = useScreener({ defaultStateType: props.type, isEphemeral: false });

watch(() => props.type, value => {
	activeScreenerType.value = value;
});

// TODO: Refetch
const { data, isLoading } = useQueryScreener(
	activeScreenerType,
	activeSort,
	computed(
		() => Object
			.entries(filtersState.value)
			.map(([filter, { selected }]) => ({
				filter,
				value: (selected as FilterCondition),
			}))
			.filter(filter => !!filter.value),
	),
	10,
);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);
</script>

<template>
	<div :class="classes.root">
		<screener-filters-component
			v-model:filters="filtersState"
			:type="props.type"
			:definitions="filtersDefinitions"
		/>
		<ui-skeleton-group v-if="isLoading && !data" :count="10" />
		<screener-table-component
			v-else-if="data"
			v-model:columns="columns"
			:rows="rows"
		/>
	</div>
</template>
<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}
</style>
