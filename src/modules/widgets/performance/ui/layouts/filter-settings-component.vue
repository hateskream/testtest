<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import {
	ModalSubmenuContent,
	ModalItemCheckbox,
	ModalBadgeTitle,
	ModalBadgeList,
	ModalBadge,
} from '@/modules/widgets/base';

const performanceStore = usePerformanceStore();
</script>

<template>
	<modal-submenu-content>
		<template #content>
			<!-- Stock Filter -->
			<modal-badge-title>Stock</modal-badge-title>
			<modal-badge-list>
				<modal-badge
					v-for="type in performanceStore.filterTypes"
					:key="type.value"
					:is-active="performanceStore.currentFilter.type === type.value"
					@click="performanceStore.setFilterType(type.value)"
				>
					{{ type.name }}
				</modal-badge>
			</modal-badge-list>

			<!-- Date Filter -->
			<modal-badge-title>Date</modal-badge-title>
			<modal-badge-list>
				<modal-badge
					v-for="timeRange in performanceStore.timeRanges"
					:key="timeRange.value"
					:is-active="performanceStore.currentFilter.timeRange === timeRange.value"
					@click="performanceStore.setTimeRange(timeRange.value)"
				>
					{{ timeRange.name }}
				</modal-badge>
			</modal-badge-list>

			<!-- Display Mode -->
			<modal-badge-title>Display</modal-badge-title>
			<modal-badge-list>
				<modal-badge
					v-for="mode in performanceStore.displayModes"
					:key="mode.value"
					:is-active="performanceStore.currentDisplayMode === mode.value"
					@click="performanceStore.setDisplayMode(mode.value)"
				>
					{{ mode.name }}
				</modal-badge>
			</modal-badge-list>

			<ui-driver />

			<!-- Settings -->
			<modal-badge-title>Settings</modal-badge-title>
			<modal-item-checkbox
				:model-value="performanceStore.isCompactMode"
				@update:model-value="performanceStore.toggleCompactMode"
			>
				Compact mode
			</modal-item-checkbox>
		</template>
	</modal-submenu-content>
</template>
