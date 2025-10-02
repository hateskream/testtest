<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { ISize } from '@/modules/dashboard-group/grid/model';
import { MIN_COL_WIDTH, MIN_ROW_HEIGHT } from '@/modules/dashboard-group/core';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

const altcoinSeasonStore = useAltcoinSeasonStore();

interface IWidgetLayoutProps {
	sizeByCells: ISize;
}
const props = defineProps<IWidgetLayoutProps>();

const widgetConfig = computed(() => altcoinSeasonStore.widgetData.value.widgetConfig);

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

const showPeriod = computed(() => {
	const { columns, rows } = gridConfig.value;
	return columns > 3 || rows > 3;
});

const widgetVars = computed(() => {
	const { w: width, h: height } = props.sizeByCells;

	const styles: CSSProperties = {};

	if (width > 3) {
		styles['--btc-n-historical-direction'] = 'row';
	}

	if (width > 5) {
		styles['--layout-direction'] = 'row';
		styles['--right-overflow-y'] = 'scroll';
	}

	return styles;
});

const containerStyles = computed(() => {
	const { columns, rows } = gridConfig.value;
	const minimumRows = 12;

	const styles = {
		'--min-col-width': `${MIN_COL_WIDTH}px`,
		'--min-row-height': `${MIN_ROW_HEIGHT}px`,
		'--grid-columns': columns.toString(),
		'--grid-rows': rows > minimumRows ? rows.toString() : minimumRows.toString(),
	};

	return styles;
});
</script>

<template>
	<div
		ref="widgetLayoutRef"
		:class="classes.widgetLayout"
		:style="{...containerStyles, ...widgetVars}"
	>
		<div :class="classes.left">
			<div
				v-if="showPeriod"
				:class="[classes.period, classes.slot]"
			>
				<slot name="period" />
			</div>

			<div :class="classes.btcAndHistoricalContainer">
				<div
					v-if="widgetConfig?.modules.performanceRank"
					:class="[classes.performanceRank, classes.slot]"
				>
					<slot name="performanceRank" :show-period="!showPeriod" />
				</div>

				<div
					v-if="widgetConfig?.modules.historicalValues"
					:class="[classes.historicalValues, classes.slot]"
				>
					<slot name="historicalValues" :show-period="!showPeriod" />
				</div>
			</div>

			<div
				v-if="widgetConfig?.modules.chart"
				:class="[classes.chart, classes.slot]"
			>
				<slot name="chart" />
			</div>
		</div>

		<div :class="classes.right">
			<div
				v-if="widgetConfig?.modules.top100"
				:class="[classes.top100, classes.slot]"
			>
				<slot name="top100" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.widgetLayout {
	display: flex;
	flex-direction: var(--layout-direction, column);
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}

.left {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
}

.right {
	min-width: 420px;
	max-width: 100%;
	height: 100%;
	overflow-y: var(--right-overflow-y, unset);
}

.slot {
	flex: 1;
}

.period {
	flex: unset;
}

.btcAndHistoricalContainer {
	display: flex;
	flex-direction: var(--btc-n-historical-direction, column);
}

.widgetLayout:has([style*='--grid-columns: 1']) .slot,
.widgetLayout:has([style*='--grid-columns: 2']) .slot,
.widgetLayout:has([style*='--grid-columns: 3']) .slot {
	padding: 8px;
}

.widgetLayout:has([style*='--grid-columns: 4']) .slot,
.widgetLayout:has([style*='--grid-columns: 5']) .slot,
.widgetLayout:has([style*='--grid-columns: 6']) .slot {
	padding: 6px;
}
</style>
