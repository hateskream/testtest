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
	<div :class="classes.container">
		<div :class="classes.listFilters">
			<div :class="classes.listFilterWithDelimiter">
				<div :class="classes.iconAllFilter">
					<ui-position>
						<template #default>
							<ui-icon
								:id="IconIds.NewsFilter"
								width="20"
								height="20"
								:class="classes.iconAllFilterColor"
							/>
						</template>

						<template #content>
							<performance-filters />
						</template>
					</ui-position>
				</div>

				<ui-delimiter />

				<modal-badge>
					<template #title>
						{{ currentFilterTypeLabel }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Stock
							</template>

							<template
								v-for="type in performanceStore.filterTypes"
								:key="type.value"
							>
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

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Date
							</template>

							<template
								v-for="range in performanceStore.timeRanges"
								:key="range.value"
							>
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
		</div>

		<div :class="classes.viewToggle">
			<button
				:class="[classes.toggleButton, { [classes.active]: performanceStore.currentDisplayMode === 'bar' }]"
				title="Bar view"
				@click="performanceStore.setDisplayMode('bar')"
			>
				<ui-icon
					:id="IconIds.Bars"
					width="20"
					height="20"
				/>
			</button>
			<button
				:class="[classes.toggleButton, { [classes.active]: performanceStore.currentDisplayMode === 'list' }]"
				title="List view"
				@click="performanceStore.setDisplayMode('list')"
			>
				<ui-icon
					:id="IconIds.List"
					width="20"
					height="20"
				/>
			</button>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 16px;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}

.allFiltersMenu {
	padding: 16px;
	font-size: 14px;
	color: var(--text-color-base-300);
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	height: 42px;
	padding-bottom: 4px;
	overflow-x: auto;
	gap: 6px;
}

.listFilterWithDelimiter {
	display: flex;
	align-items: center;
	gap: 6px;
}

.icon {
	color: var(--icon-color-base-200);
}

.viewToggle {
	display: flex;
	align-items: center;
	padding: 2px;
	background: var(--bg-color-surface-02);
	border-radius: 6px;
	gap: 2px;
}

.toggleButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 28px;
	height: 24px;
	color: var(--text-color-base-200);
	background: transparent;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.toggleButton:hover {
	color: var(--text-color-base-300);
	background: var(--bg-color-surface-03);
}

.toggleButton.active {
	color: var(--text-color-white);
	background: var(--accent-color);
}
</style>
