<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type FiltersDefinition, type FiltersState, type IFilterState, ScreenerType } from '../model';
import { FilterBadgeModal } from './filter';

import ScreenerModalFiltersComponent from './screener-modal-filters-component.vue';

const filters = defineModel<FiltersState>('filters', { required: true });
// const markets = defineModel<string[]>('markets', { required: true });

interface IScreenerFiltersProps {
	type: ScreenerType;
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
	<div :class="classes.container">
		<ui-position position="right-start">
			<template #title>
				<ui-icon
					:id="IconIds.NewsFilter"
					width="20"
					height="20"
					:class="classes.icon"
				/>
			</template>
			<template #content>
				<screener-modal-filters-component
					v-model:filters="filters"
					:definitions="props.definitions"
				/>
			</template>
		</ui-position>
		<filter-badge-modal
			v-for="(config, key) in props.definitions"
			:key="key"
			display-variant="new"
			:config="config"
			:model-value="filters[key]"
			@update:model-value="updateFilter(key, $event)"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	margin-bottom: 8px;
}

.icon {
	margin: 0 6px;
	color: var(--icon-color-base-300);
	cursor: pointer;
}
</style>
