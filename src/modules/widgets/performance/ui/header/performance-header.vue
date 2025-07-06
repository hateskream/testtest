<script setup lang="ts">
// import { computed } from 'vue';

import { usePerformanceStore } from '../../stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const performanceStore = usePerformanceStore();

// const currentFilterTypeLabel = computed(() => {
// 	const currentType = performanceStore.currentFilter.type;
// 	return performanceStore.filterTypes.find(type => type.value === currentType)?.name || 'Industry';
// });

// const currentTimeRangeLabel = computed(() => {
// 	const currentRange = performanceStore.currentFilter.timeRange;
// 	return performanceStore.timeRanges.find(range => range.value === currentRange)?.name || 'Today';
// });
</script>

<template>
	<div class="performance-header">
		<div class="header-top">
			<div class="view-toggle">
				<button
					:class="{ active: performanceStore.currentDisplayMode === 'bar' }"
					class="toggle-button"
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
					:class="{ active: performanceStore.currentDisplayMode === 'list' }"
					class="toggle-button"
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

		<div class="header-filters">
			<div class="dropdown-container">
				<select
					:value="performanceStore.currentFilter.type"
					class="filter-dropdown"
					@change="performanceStore.setFilterType(($event.target as HTMLSelectElement).value as any)"
				>
					<option
						v-for="type in performanceStore.filterTypes"
						:key="type.value"
						:value="type.value"
					>
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="dropdown-container">
				<select
					:value="performanceStore.currentFilter.timeRange"
					class="filter-dropdown"
					@change="performanceStore.setTimeRange(($event.target as HTMLSelectElement).value as any)"
				>
					<option
						v-for="range in performanceStore.timeRanges"
						:key="range.value"
						:value="range.value"
					>
						{{ range.name }}
					</option>
				</select>
			</div>
		</div>
	</div>
</template>

<style scoped>
.performance-header {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-bottom: 1px solid var(--border-color-base-100);
}

.header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.header-title {
	margin: 0;
	font-weight: 600;
	font-size: 16px;
	color: var(--text-color-base-400);
}

.header-filters {
	display: flex;
	align-items: center;
	gap: 8px;
}

.dropdown-container {
	position: relative;
}

.filter-dropdown {
	min-width: 80px;
	padding: 6px 12px;
	font-weight: 500;
	font-size: 12px;
	color: var(--text-color-base-300);
	background: var(--bg-color-surface-02);
	border: 1px solid var(--border-color-base-100);
	border-radius: 6px;
	cursor: pointer;
}

.filter-dropdown:hover {
	background: var(--bg-color-surface-03);
}

.filter-dropdown:focus {
	border-color: var(--accent-color);
	outline: none;
}

.view-toggle {
	display: flex;
	align-items: center;
	padding: 2px;
	background: var(--bg-color-surface-02);
	border-radius: 6px;
	gap: 2px;
}

.toggle-button {
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

.toggle-button:hover {
	color: var(--text-color-base-300);
	background: var(--bg-color-surface-03);
}

.toggle-button.active {
	color: var(--text-color-white);
	background: var(--accent-color);
}
</style>
