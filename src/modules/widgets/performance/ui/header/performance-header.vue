<script setup lang="ts">
import { computed } from 'vue';

import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';

import PerformanceFilters from '../modals/performance-filters.vue';
import ViewToggle from './view-toggle.vue';

const performanceStore = usePerformanceStore();

const currentFilterTypeLabel = computed(() => {
	const currentType = performanceStore.currentFilter.type;
	return performanceStore.filterTypes.find(type => type.value === currentType)?.name || 'Industry';
});

const currentTimeRangeLabel = computed(() => {
	const currentRange = performanceStore.currentFilter.timeRange;
	return performanceStore.timeRanges.find(range => range.value === currentRange)?.name || 'Today';
});
</script>

<template>
	<div :class="classes.performanceHeader">
		<div :class="classes.listFilters">
			<ui-position  :class="classes.iconAllFilter">
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<performance-filters />
				</template>
			</ui-position>

			<ui-delimiter />

			<modal-badge>
				<template #title>
					{{ currentFilterTypeLabel }}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Stock</template>

						<template v-for="type in performanceStore.filterTypes" :key="type.value">
							<modal-item-selector
								:model-value="performanceStore.currentFilter.type === type.value"
								@update:model-value="performanceStore.setFilterType(type.value)"
							>
								{{ type.name }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge>
				<template #title>
					{{ currentTimeRangeLabel }}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Date</template>

						<template v-for="range in performanceStore.timeRanges" :key="range.value">
							<modal-item-selector
								:model-value="performanceStore.currentFilter.timeRange === range.value"
								@update:model-value="performanceStore.setTimeRange(range.value)"
							>
								{{ range.name }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>
		</div>
		<view-toggle />
	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 16px;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
