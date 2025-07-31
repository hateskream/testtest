<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed } from 'vue';

import { GenericDataTable } from '@/modules/table';
import type {
	IGenericTableColumn,
	IGenericTableRow,
	ISortConfig,
} from '@/modules/table';
import { PERFORMANCE_COLORS } from '@/modules/widgets/performance/const';
import type { IPerformanceItem } from '@/modules/widgets/performance/model';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';

import PerformanceBarCell from './performance-bar-cell.vue';

interface IPerformanceTableProps {
	performanceData: IPerformanceItem[];
	isCompact: boolean;
	size: { width: number; height: number };
}

const props = defineProps<IPerformanceTableProps>();

const performanceStore = usePerformanceStore();

// Helper function to get time period label
const getTimePeriodLabel = computed(() => {
	const { timeRange } = performanceStore.currentFilter;
	switch (timeRange) {
		case 'today': return '24h';
		case 'yesterday': return 'Yesterday';
		case 'week': return '7d';
		case 'custom': return 'Custom';
		default: return '24h';
	}
});

// Calculate maximum absolute value for bar scaling
const maxAbsValue = computed(() => {
	if (props.performanceData.length === 0) {
		return 100;
	}
	return Math.max(...props.performanceData.map(item => Math.abs(item.change)));
});

// Configuration for table columns - только 2 колонки
const columns = computed<IGenericTableColumn[]>(() => [
	{
		key: 'symbol',
		label: 'Symbol',
		shortLabel: 'Symbol',
		position: 0,
		sortable: true,
		draggable: false,
		visible: true,
		type: 'string' as const,
		group: {
			name: 'general',
			displayName: 'General',
		},
	},
	{
		key: 'change',
		label: `Chg%, ${getTimePeriodLabel.value}`,
		shortLabel: 'Chg%',
		position: 1,
		sortable: true,
		draggable: false,
		visible: true,
		type: 'percent' as const,
		group: {
			name: 'performance',
			displayName: 'Performance',
		},
	},
]);

// Convert performance data to table rows
const tableRows = computed<IGenericTableRow[]>(() =>
	props.performanceData.map(item => ({
		id: item.id,
		data: {
			symbol: item.name,
			change: item.change,
		},
		metadata: {
			original: item,
		},
	})),
);

// Sort configuration - по умолчанию сортируем по изменению по убыванию
const sortConfig = computed<ISortConfig>(() => ({
	columnKey: 'change',
	direction: 'desc',
}));

// Helper functions for formatting
function getChangeColor(change: number): string {
	return change >= 0 ? PERFORMANCE_COLORS.POSITIVE : PERFORMANCE_COLORS.NEGATIVE;
}

function formatChange(change: number): string {
	const sign = change >= 0 ? '+' : '';
	return `${sign}${change.toFixed(2)}%`;
}
</script>

<template>
	<generic-data-table
		:columns="columns"
		:rows="tableRows"
		:sort-config="sortConfig"
		:enable-drag-drop="false"
		:enable-column-reordering="false"
		:enable-sorting="true"
		:enable-column-settings="false"
		:sticky-header="false"
		:sticky-first-column="false"
		:enable-row-actions="false"
		:show-header="true"
	>
		<!-- TODO: Custom cell content for symbol -->
		<template #cell-symbol="{ value }">
			<span>{{ value }}</span>
		</template>

		<template #cell-change="{ value }">
			<performance-bar-cell
				v-if="performanceStore.currentDisplayMode === 'bar'"
				:value="value"
				:max-abs-value="maxAbsValue"
			/>

			<span v-else :style="{ color: getChangeColor(value) }">
				{{ formatChange(value) }}
			</span>
		</template>
	</generic-data-table>
</template>

<style module="classes">
.compactMode {
	/* TODO: add styles */
}
</style>
