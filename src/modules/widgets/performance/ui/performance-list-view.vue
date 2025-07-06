<script setup lang="ts">
import { PERFORMANCE_COLORS } from '../const';
import type { IPerformanceItem } from '../model';

interface IPerformanceListViewProps {
	performanceData: IPerformanceItem[];
	isCompact: boolean;
	size: { width: number; height: number };
}

defineProps<IPerformanceListViewProps>();

function getChangeColor(change: number): string {
	return change >= 0 ? PERFORMANCE_COLORS.POSITIVE : PERFORMANCE_COLORS.NEGATIVE;
}

function formatChange(change: number): string {
	const sign = change >= 0 ? '+' : '';
	return `${sign}${change.toFixed(2)}%`;
}
</script>

<template>
	<div class="performance-list-view" :class="{ 'compact': isCompact }">
		<div class="list-container">
			<div
				v-for="item in performanceData"
				:key="item.id"
				class="list-item"
			>
				<div class="item-info">
					<span class="item-name">{{ item.name }}</span>
					<span
						class="item-change"
						:style="{ color: getChangeColor(item.change) }"
					>
						{{ formatChange(item.change) }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.performance-list-view {
	height: 100%;
	padding: 16px;
	overflow-y: auto;
}

.performance-list-view.compact {
	padding: 8px;
}

.list-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.performance-list-view.compact .list-container {
	gap: 4px;
}

.list-item {
	padding: 8px 0;
	border-bottom: 1px solid var(--border-color-base-100);
}

.list-item:last-child {
	border-bottom: none;
}

.performance-list-view.compact .list-item {
	padding: 4px 0;
}

.item-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-name {
	flex: 1;
	margin-right: 8px;
	overflow: hidden;
	font-weight: 400;
	font-size: 12px;
	color: var(--text-color-base-300);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.performance-list-view.compact .item-name {
	font-size: 10px;
}

.item-change {
	font-weight: 500;
	font-size: 12px;
	white-space: nowrap;
}

.performance-list-view.compact .item-change {
	font-size: 10px;
}
</style>
