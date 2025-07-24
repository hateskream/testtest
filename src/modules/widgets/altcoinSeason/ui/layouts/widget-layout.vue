<script setup lang="ts">
import { computed } from 'vue';

import type { IAltcoinSeasonConfig } from '@/modules/widgets/altcoinSeason/model';
import type { ISize } from '@/modules/dashboard-group/grid/model';
import { MIN_COL_WIDTH, MIN_ROW_HEIGHT } from '@/modules/dashboard-group/core';

interface IWidgetLayoutProps {
	widgetConfig: IAltcoinSeasonConfig | null;
	sizeByCells: ISize;
}

const props = defineProps<IWidgetLayoutProps>();

const gridConfig = computed(() => {
	const { w: width, h: height } = props.sizeByCells;
	let columns = 0;
	let rows = height;

	if (width >= 7 && height >= 10) {
		columns = 7;
	} else if (width >=4) {
		columns = 4;
	} else {
		columns = 2;
	}

	return {
		columns,
		rows,
	};
});

const containerStyles = computed(() => {
	const { columns, rows } = gridConfig.value;

	const styles = {
		'--min-col-width': `${MIN_COL_WIDTH}px`,
		'--min-row-height': `${MIN_ROW_HEIGHT}px`,
		'--grid-columns': columns.toString(),
		'--grid-rows': rows.toString(),
	};

	return styles;
});

const showPeriod = computed(() => {
	const { columns, rows } = gridConfig.value;
	return columns > 3 || rows > 3;
});

const adaptiveGridAreas = computed(() => {
	const { columns, rows } = gridConfig.value;
	const periodVisible = showPeriod.value;

	if (columns === 7 && rows >= 10) {
		if (periodVisible) {
			return {
				period: '1 / 1 / 2 / -1',
				performanceRank: '2 / 1 / 5 / 3',
				historicalValues: '2 / 3 / 5 / 5',
				chart: '5 / 1 / -1 / 5',
				top100: '2 / 5 / -1 / -1',
			};
		} else {
			return {
				performanceRank: '1 / 1 / 4 / 3',
				historicalValues: '1 / 3 / 4 / 5',
				chart: '4 / 1 / -1 / 5',
				top100: '1 / 5 / -1 / -1',
			};
		}
	}

	if (columns === 4) {
		if (periodVisible) {
			return {
				period: '1 / 1 / 2 / -1',
				performanceRank: '2 / 1 / 5 / 3',
				historicalValues: '2 / 3 / 5 / -1',
				chart: '5 / 1 / -1 / -1',
				top100: '13 / 1 / -1 / -1',
			};
		} else {
			return {
				performanceRank: '1 / 1 / 4 / 3',
				historicalValues: '1 / 3 / 4 / -1',
				chart: '4 / 1 / -1 / -1',
				top100: '12 / 1 / -1 / -1',
			};
		}
	}

	// default (columns 2 or other)
	if (periodVisible) {
		return {
			period: '1 / 1 / 2 / -1',
			performanceRank: '2 / 1 / 5 / -1',
			historicalValues: '5 / 1 / 8 / -1',
			chart: '8 / 1 / -1 / -1',
			top100: '13 / 1 / -1 / -1',
		};
	} else {
		return {
			performanceRank: '1 / 1 / 4 / -1',
			historicalValues: '4 / 1 / 7 / -1',
			chart: '7 / 1 / -1 / -1',
			top100: '12 / 1 / -1 / -1',
		};
	}
});
</script>

<template>
	<div
		ref="widgetLayoutRef"
		:class="classes.widgetLayout"
		:style="containerStyles"
	>

		<div
			v-if="showPeriod"
			:class="[classes.period, classes.slot]"
			:style="{ gridArea: adaptiveGridAreas.period }"
		>
			<slot name="period">
				Period switch
			</slot>
		</div>

		<div
			v-if="props.widgetConfig?.modules.performanceRank"
			:class="[classes.performanceRank, classes.slot]"
			:style="{ gridArea: adaptiveGridAreas.performanceRank }"
		>
			<slot name="performanceRank">
				Performance Rank
			</slot>
		</div>

		<div
			v-if="props.widgetConfig?.modules.historicalValues"
			:class="[classes.historicalValues, classes.slot]"
			:style="{ gridArea: adaptiveGridAreas.historicalValues }"
		>
			<slot name="historicalValues">
				Historical Values
			</slot>
		</div>

		<div
			v-if="props.widgetConfig?.modules.top100"
			:class="[classes.top100, classes.slot]"
			:style="{ gridArea: adaptiveGridAreas.top100 }"
		>
			<slot name="top100">
				Top 100 coins performance
			</slot>
		</div>

		<div
			v-if="props.widgetConfig?.modules.chart"
			:class="[classes.chart, classes.slot]"
			:style="{ gridArea: adaptiveGridAreas.chart }"
		>
			<slot name="chart">
				Chart
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.widgetLayout {
	display: grid;
	width: 100%;
	height: 100%;
	grid-template-columns: repeat(var(--grid-columns, 7), minmax(var(--min-col-width), 1fr));
	grid-template-rows: 35px repeat(var(--grid-rows, 9), minmax(var(--min-row-height), 1fr));
	grid-gap: 8px;
	overflow-y: auto;
}

.slot {
	padding: 4px;
}

.period {
	/* background-color: #494949; */
}

.performanceRank {
	/* Убираем статичные grid-area, используем динамические из :style */
}

.historicalValues {
	background-color: #494949;
}

.top100 {
	/* some style */
}

.chart {
	background-color: #494949;
}

/* Адаптивные стили для разных размеров */
.widgetLayout:has([style*='--grid-columns: 1']) .slot,
.widgetLayout:has([style*='--grid-columns: 2']) .slot,
.widgetLayout:has([style*='--grid-columns: 3']) .slot {
	/* Увеличиваем padding для маленьких экранов */
	padding: 8px;
}

.widgetLayout:has([style*='--grid-columns: 4']) .slot,
.widgetLayout:has([style*='--grid-columns: 5']) .slot,
.widgetLayout:has([style*='--grid-columns: 6']) .slot {
	/* Средний padding для средних экранов */
	padding: 6px;
}
</style>
