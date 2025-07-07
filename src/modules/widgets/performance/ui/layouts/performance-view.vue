<script setup lang="ts">
import { computed } from 'vue';

import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import type { IPerformanceItem } from '@/modules/widgets/performance/model';

import PerformanceHeader from '../header/performance-header.vue';
import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	performanceData: IPerformanceItem[];
	size: { width: number; height: number };
}

const props = defineProps<IViewComponentProps>();

const performanceStore = usePerformanceStore();

const sortedData = computed(() => {
	return [...props.performanceData].sort((a, b) => b.change - a.change);
});
</script>

<template>
	<div :class="classes.performanceView">
		<performance-header />

		<div :class="classes.performanceContent">
			<performance-table
				:performance-data="sortedData"
				:is-compact="performanceStore.isCompactMode"
				:size="props.size"
			/>
		</div>
	</div>
</template>

<style module="classes">
.performanceView {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.performanceContent {
	flex: 1;
	overflow: hidden;
}
</style>
