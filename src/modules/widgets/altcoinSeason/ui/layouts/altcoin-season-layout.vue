<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { ISize } from '@/modules/dashboard-group/grid/model';
import type { IAltcoinSeasonConfig } from '@/modules/widgets/altcoinSeason/model';

interface IWidgetLayoutProps {
	sizeByCells: ISize;
	widgetDisplaySettings: IAltcoinSeasonConfig['modules'];
}
const props = defineProps<IWidgetLayoutProps>();

const widgetVars = computed(() => {
	const { w: width } = props.sizeByCells;

	const styles: CSSProperties = {};

	if (width >= 3) {
		styles['--btc-n-historical-direction'] = 'row';
	}

	if (width >= 5) {
		styles['--layout-direction'] = 'row';
		styles['--right-overflow-y'] = 'scroll';
		styles['--left-and-layout-overflow-y'] = 'hidden';
	}

	return styles;
});
</script>

<template>
	<div
		ref="widgetLayoutRef"
		:class="classes.widgetLayout"
		:style="widgetVars"
	>
		<div :class="classes.left">
			<div
				:class="[classes.period, classes.slot]"
			>
				<slot name="period" />
			</div>

			<div :class="classes.btcAndHistoricalContainer">
				<div
					v-if="widgetDisplaySettings?.performanceRank"
					:class="[classes.performanceRank, classes.slot]"
				>
					<slot name="performanceRank" />
				</div>

				<div
					v-if="widgetDisplaySettings?.historicalValues"
					:class="[classes.historicalValues, classes.slot]"
				>
					<slot name="historicalValues" />
				</div>
			</div>

			<div
				v-if="widgetDisplaySettings?.chart"
				:class="[classes.chart, classes.slot]"
			>
				<slot
					name="chart"
					:show-x="props.sizeByCells.w >= 4"
					:show-y="props.sizeByCells.w >= 4"
				/>
			</div>
		</div>

		<div :class="classes.right">
			<div
				v-if="widgetDisplaySettings?.top100"
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
	overflow-y: var(--left-and-layout-overflow-y, scroll);
}

.left {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	overflow-y: var(--left-and-layout-overflow-y, unset);
}

.right {
	width: 100%;
	max-width: 360px;
	height: 100%;
	overflow-y: var(--right-overflow-y, unset);
}

.slot {
	flex: 1;
}

.period {
	flex: unset;
}

.chart {
	overflow: hidden;
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
