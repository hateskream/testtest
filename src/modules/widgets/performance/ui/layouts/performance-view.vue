<script setup lang="ts">
import { computed } from 'vue';

import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import type { IPerformanceItem } from '@/modules/widgets/performance/model';

import PerformanceHeader from '../header/performance-header.vue';
import PerformanceBarChart from '../table/performance-bar-chart.vue';
import PerformanceListView from '../table/performance-list-view.vue';

interface IViewComponentProps {
	performanceData: IPerformanceItem[];
	size: { width: number; height: number };
}

const props = defineProps<IViewComponentProps>();

const performanceStore = usePerformanceStore();

const sortedData = computed(() => {
	return [...props.performanceData].sort((a, b) => b.change - a.change);
});

const isBarMode = computed(() => performanceStore.currentDisplayMode === 'bar');
const isListMode = computed(() => performanceStore.currentDisplayMode === 'list');
</script>

<template>
	<div class="performance-view">
		<performance-header />

		<div class="performance-content">
			<performance-bar-chart
				v-if="isBarMode"
				:performance-data="sortedData"
				:is-compact="performanceStore.isCompactMode"
				:size="props.size"
			/>
			<performance-list-view
				v-else-if="isListMode"
				:performance-data="sortedData"
				:is-compact="performanceStore.isCompactMode"
				:size="props.size"
			/>
		</div>
	</div>
</template>

<style scoped>
.performance-view {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.performance-content {
	flex: 1;
	overflow: hidden;
}
</style>
