<script setup lang="ts">
import { computed } from 'vue';

import { PERFORMANCE_COLORS } from '@/modules/widgets/performance/const';
import type { IPerformanceItem } from '@/modules/widgets/performance/model';

interface IPerformanceBarChartProps {
	performanceData: IPerformanceItem[];
	isCompact: boolean;
	size: { width: number; height: number };
}

const props = defineProps<IPerformanceBarChartProps>();

const maxAbsValue = computed(() => {
	const values = props.performanceData.map(item => Math.abs(item.change));
	return Math.max(...values);
});

function getBarColor(change: number): string {
	return change >= 0 ? PERFORMANCE_COLORS.POSITIVE : PERFORMANCE_COLORS.NEGATIVE;
}

function getBarWidth(change: number): number {
	if (maxAbsValue.value === 0) {
		return 0;
	}
	return (Math.abs(change) / maxAbsValue.value) * 100;
}

function formatChange(change: number): string {
	const sign = change >= 0 ? '+' : '';
	return `${sign}${change.toFixed(2)}%`;
}
</script>

<template>
	<div class="performance-bar-chart" :class="{ 'compact': isCompact }">
		<div class="chart-container">
			<div
				v-for="item in performanceData"
				:key="item.id"
				class="bar-row"
			>
				<div class="bar-info">
					<span class="bar-name">{{ item.name }}</span>
					<span
						class="bar-change"
						:style="{ color: getBarColor(item.change) }"
					>
						{{ formatChange(item.change) }}
					</span>
				</div>
				<div class="bar-container">
					<div
						class="bar"
						:style="{
							width: getBarWidth(item.change) + '%',
							backgroundColor: getBarColor(item.change)
						}"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.performance-bar-chart {
	height: 100%;
	padding: 12px 16px;
	overflow-y: auto;
}

.performance-bar-chart.compact {
	padding: 8px 12px;
}

.chart-container {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.performance-bar-chart.compact .chart-container {
	gap: 8px;
}

.bar-row {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.bar-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2px;
}

.bar-name {
	flex: 1;
	margin-right: 8px;
	overflow: hidden;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.performance-bar-chart.compact .bar-name {
	font-size: 11px;
}

.bar-change {
	font-weight: 600;
	font-size: 13px;
	white-space: nowrap;
}

.performance-bar-chart.compact .bar-change {
	font-size: 11px;
}

.bar-container {
	height: 8px;
	overflow: hidden;
	background-color: var(--bg-color-surface-02);
	border-radius: 4px;
}

.performance-bar-chart.compact .bar-container {
	height: 6px;
}

.bar {
	min-width: 4px;
	height: 100%;
	border-radius: 4px;
	transition: width 0.3s ease;
}

.performance-bar-chart.compact .bar {
	min-width: 3px;
	border-radius: 3px;
}
</style>
