<script setup lang="ts">
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const performanceStore = usePerformanceStore();
</script>

<template>
	<div :class="classes.performanceHeader">
		<div :class="classes.headerFilters">
			<div :class="classes.dropdownContainer">
				<select
					:value="performanceStore.currentFilter.type"
					:class="classes.filterDropdown"
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

			<div :class="classes.dropdownContainer">
				<select
					:value="performanceStore.currentFilter.timeRange"
					:class="classes.filterDropdown"
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
.performanceHeader {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 16px;
	border-bottom: 1px solid var(--border-color-base-100);
}

.headerTitle {
	margin: 0;
	font-weight: 600;
	font-size: 16px;
	color: var(--text-color-base-400);
}

.headerFilters {
	display: flex;
	align-items: center;
	gap: 8px;
}

.dropdownContainer {
	position: relative;
}

.filterDropdown {
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

.filterDropdown:hover {
	background: var(--bg-color-surface-03);
}

.filterDropdown:focus {
	border-color: var(--accent-color);
	outline: none;
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
