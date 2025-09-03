<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

interface ISectorData {
	name: string;
	percentage: number;
	color: string;
}

const sectors: ISectorData[] = [
	{
		name: 'Financial Services',
		percentage: 24.49,
		color: '#5B5CE3',
	},
	{
		name: 'Industrials',
		percentage: 12.77,
		color: '#FF8A4A',
	},
	{
		name: 'Technology',
		percentage: 19.08,
		color: '#9B59B6',
	},
	{
		name: 'Basic Materials',
		percentage: 4.92,
		color: '#E91E63',
	},
	{
		name: 'Healthcare',
		percentage: 15.89,
		color: '#8E24AA',
	},
	{
		name: 'Consumer Defensive',
		percentage: 4.74,
		color: '#FFC107',
	},
	{
		name: 'Consumer Cyclical',
		percentage: 13.61,
		color: '#C2185B', // Dark pink
	},
	{
		name: 'Energy',
		percentage: 2.41,
		color: '#4CAF50', // Green
	},
];

const lastUpdate = 'last update: 10 Jul, 2025';
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.headerContainer">
				<div :class="classes.title" class="header-h01">
					Sectors
				</div>
				<div :class="classes.lastUpdate" class="paragraph-p-02">
					{{ lastUpdate }}
				</div>
			</div>
		</template>

		<template #body>
			<div :class="classes.container">
				<div :class="classes.sectorsGrid">
					<div
						v-for="sector in sectors"
						:key="sector.name"
						:class="classes.sectorItem"
					>
						<div :class="classes.sectorInfo">
							<div
								:class="classes.colorIndicator"
								:style="{ backgroundColor: sector.color }"
							></div>
							<span :class="classes.sectorName" class="paragraph-p-00">{{ sector.name }}</span>
						</div>
						<div :class="classes.sectorPercentage" class="paragraph-p-00">
							{{ sector.percentage }}%
						</div>
					</div>
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.headerContainer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.title {
	color: var(--text-color-base-300);
}

.lastUpdate {
	color: var(--text-color-base-500);
}

.container {
	container-type: inline-size;
	width: 100%;
}

.sectorsGrid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0 24px;
	width: 100%;
}

@container (max-width: 600px) {
	.sectorsGrid {
		grid-template-columns: 1fr;
	}
}

.sectorItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 11px 0;
	border-bottom: 1px solid var(--border-color-surface-02);
}

.sectorItem:nth-last-child(-n+2) {
	border-bottom: none;
}


@container (max-width: 600px) {
	.sectorsGrid {
		grid-template-columns: 1fr;
	}

	.sectorItem:nth-last-child(-n+2) {
		border-bottom: 1px solid var(--border-color-surface-02);
	}

	.sectorItem:last-child {
		border-bottom: none;
	}
}


.sectorInfo {
	display: flex;
	flex: 1;
	align-items: center;
	gap: 8px;
}

.colorIndicator {
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: 50%;
}

.sectorName {
	line-height: 1.2;
	color: var(--text-color-base-300);
}

.sectorPercentage {
	flex-shrink: 0;
	margin-left: 8px;
	color: var(--text-color-base-500);
}
</style>
