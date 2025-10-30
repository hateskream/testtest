<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { ISize } from '@/modules/dashboard-group/grid/model';
import type { IAltcoinSeasonConfig } from '@/modules/widgets/altcoinSeason/model';

interface IWidgetLayoutProps {
	sizeByCells: ISize;
	moduleSettings: IAltcoinSeasonConfig['modules'];
}
const props = defineProps<IWidgetLayoutProps>();

const hasAnyLeftSideTrueOption = computed(() => {
	const { historicalValues, chart, performanceRank } = props.moduleSettings;
	return historicalValues || chart || performanceRank;
});

const widgetVars = computed(() => {
	const { w: width } = props.sizeByCells;

	const styles: CSSProperties = {};

	if (!hasAnyLeftSideTrueOption.value) {
		styles['--right-width'] = '100%';
	}

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

const chartSlotProps = computed(() => {
	const { w, h } = props.sizeByCells;
	const settings = props.moduleSettings;

	if (!settings.performanceRank && !settings.historicalValues) {
		return {
			showX: true,
			showY: true,
		};
	}

	if (w >= 4 && h <= 6) {
		return {
			showX: false,
			showY: false,
		};
	}

	return {
		showX: props.sizeByCells.w >= 4,
		showY: props.sizeByCells.w >= 4,
	};
});

const widgetDisplays = computed<IAltcoinSeasonConfig['modules']>(() => {
	const { w, h } = props.sizeByCells;
	const settings = props.moduleSettings;

	if (!hasAnyLeftSideTrueOption.value) {
		return {
			top100: true,
			performanceRank: false,
			chart: false,
			historicalValues: false,
		};
	}

	if (w <= 4 && !(settings.historicalValues || settings.performanceRank)) {
		return {
			performanceRank: true,
			historicalValues: true,
			chart: true,
			top100: true,
		};
	}

	if (w === 2 && h <= 5) {
		return {
			performanceRank: true,
			historicalValues: false,
			top100: false,
			chart: false,
		};
	}

	if (w < 5 && h >= 11) {
		return {
			performanceRank: true,
			historicalValues: true,
			top100: true,
			chart: true,
		};
	}

	if (w >= 3 && h <= 5) {
		return {
			performanceRank: true,
			historicalValues: true,
			top100: true,
			chart: false,
		};
	}

	if (w >= 3 && w <= 4 && h >= 4) {
		return {
			performanceRank: true,
			historicalValues: true,
			chart: true,
			top100: false,
		};
	}

	if (w <= 4 && h <= 7) {
		return {
			performanceRank: true,
			historicalValues: true,
			chart: false,
			top100: false,
		};
	}
	if (w <= 4 && h >= 8) {
		return {
			performanceRank: true,
			historicalValues: true,
			chart: true,
			top100: false,
		};
	}

	return {
		performanceRank: true,
		historicalValues: true,
		chart: true,
		top100: true,
	};
});

const showCompactTop100 = computed(() =>
	widgetDisplays.value.top100 &&
	props.moduleSettings.top100 &&
	props.sizeByCells.w < 5 &&
	props.sizeByCells.h >= 8,
);

const showRightTop100 = computed(() =>
	widgetDisplays.value.top100 && props.moduleSettings.top100 && !showCompactTop100.value,
);
</script>

<template>
	<div
		ref="widgetLayoutRef"
		:class="classes.widgetLayout"
		:style="widgetVars"
	>
		<div v-if="hasAnyLeftSideTrueOption" :class="classes.left">
			<div
				:class="[classes.period, classes.slot]"
			>
				<slot name="period" />
			</div>

			<div :class="classes.btcAndHistoricalContainer">
				<div
					v-if="widgetDisplays.performanceRank && moduleSettings?.performanceRank"
					:class="[classes.performanceRank, classes.slot]"
				>
					<slot name="performanceRank" />
				</div>

				<div
					v-if="widgetDisplays.historicalValues && moduleSettings?.historicalValues"
					:class="[classes.historicalValues, classes.slot]"
				>
					<slot name="historicalValues" />
				</div>
			</div>

			<div
				v-if="widgetDisplays.chart && moduleSettings?.chart"
				:class="[classes.chart, classes.slot]"
				:style="{overflow: showCompactTop100 ? 'unset' : 'hidden'}"
			>
				<slot
					name="chart"
					:show="widgetDisplays.chart && widgetDisplays?.chart"
					v-bind="chartSlotProps"
				/>
			</div>

			<div
				v-if="showCompactTop100"
				:class="classes.compact100"
			>
				<slot name="top100" />
			</div>
		</div>

		<div v-if="showRightTop100" :class="classes.right">
			<div
				:class="[classes.top100, classes.slot]"
			>
				<slot
					name="top100"
				/>
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
}

.left {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-height: 100%;
	overflow: hidden;
}

.right {
	width: 100%;
	max-width: var(--right-width, 360px);
	height: 100%;
	overflow-y: var(--right-overflow-y, unset);
}

.slot {
	flex: 1;
}

.period {
	flex: unset;
}

.compact100 {
	overflow: hidden;
}

@container top (max-height: 199px) {
	.compact100 {
		display: none;
	}
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
