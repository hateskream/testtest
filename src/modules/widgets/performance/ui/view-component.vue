<script setup lang="ts">
import { computed } from 'vue';

import { usePerformanceStore } from '../stores';
import type { IPerformanceItem } from '../model';

import PerformanceBarChart from './performance-bar-chart.vue';
import PerformanceListView from './performance-list-view.vue';

interface IViewComponentProps {
	performanceData: IPerformanceItem[];
	size: { width: number; height: number };
}

const props = defineProps<IViewComponentProps>();
defineEmits<{
	refetch: [];
}>();

const performanceStore = usePerformanceStore();

const sortedData = computed(() => {
	return [...props.performanceData].sort((a, b) => b.change - a.change);
});

const isBarMode = computed(() => performanceStore.currentDisplayMode === 'bar');
const isListMode = computed(() => performanceStore.currentDisplayMode === 'list');
</script>

<template>
	<div class="performance-view">
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
</template>

<style scoped>
.performance-view {
	height: 100%;
	overflow: hidden;
}
</style>
