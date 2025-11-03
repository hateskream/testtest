<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { RangeChart, type RangeChart as RangeChartType } from '@/shared/ui/chart-range';
import {
	DominanceDateRange,
	type IDisplaySettings,
	type IDominanceSnapshot,
	type IDominanceSnapshotValues,
} from '../../model';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';
import DominanceHistoricalGrid from './historical/dominance-historical-grid.vue';
import DominanceSegments from './segments/dominance-segments.vue';
import DominanceHistoryChart from './dominance-history-chart.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IDominanceSnapshot[];
	displaySettings: IDisplaySettings;
	selectedTickers: string[];
}

const props = defineProps<IViewComponentProps>();

const activeDateRange = defineModel<DominanceDateRange>('dateRange', { required: true });

const sortedSnapshots = computed(() => [...props.data].sort(
	(a, b) => +b.dominance.current - +a.dominance.current),
);

const otherDominanceValues = computed(() => {
	return sortedSnapshots.value.reduce((acc, item) => {
		acc.current -= item.dominance.current;
		acc.yesterday -= item.dominance.yesterday;
		acc.week -= item.dominance.week;
		acc.year -= item.dominance.year;

		return acc;
	}, { current: 100, yesterday: 100, week: 100, year: 100 } as IDominanceSnapshotValues);
});

const dateRangeToRangeChart: Record<DominanceDateRange, RangeChartType> = {
	[DominanceDateRange.Day]: RangeChart['24H'],
	[DominanceDateRange.Week]: RangeChart['7D'],
	[DominanceDateRange.Month]: RangeChart['1M'],
	[DominanceDateRange.SixMonths]: RangeChart['6M'],
	[DominanceDateRange.Year]: RangeChart['1Y'],
	[DominanceDateRange.All]: RangeChart['ALL'],
};

const chartRanges = Object.values(DominanceDateRange).map(key => dateRangeToRangeChart[key]);

const activeChartRange = computed(() => dateRangeToRangeChart[activeDateRange.value]);

function selectDateRange(rangeChart: RangeChartType) {
	const dateRangeFilter = Object.entries(dateRangeToRangeChart)
		.find(([_, value]) => value === rangeChart);

	if (dateRangeFilter) {
		activeDateRange.value = dateRangeFilter[0] as DominanceDateRange;
	}
}

const isShowSegments = computed(() => props.displaySettings.isShowIndicator || !props.displaySettings.isShowHistorical);
const isShowHistorical = computed(() => props.displaySettings.isShowHistorical && props.meta.size.w > 1 &&
	(props.meta.size.w >= 2 && props.meta.size.h < 3 || props.meta.size.w >= 3 || props.meta.size.h >= 5),
);

const isTopColumnView = computed(() => props.meta.size.w < 3 || props.meta.size.h < 3);
const isTopWrapView = computed(() => props.meta.size.w <= 3 && props.meta.size.h > 5);

const isSmall = computed(() => props.meta.size.w === 1);
</script>

<template>
	<div :class="classes.root">
		<div
			v-if="sortedSnapshots.length > 0"
			:class="[
				classes.top,
				{ [classes.column]: isTopColumnView, [classes.wrap]: isTopWrapView , [classes.small]: isSmall }
			]"
		>
			<dominance-segments
				v-if="props.displaySettings.isShowIndicator || isShowSegments"
				:snapshots="sortedSnapshots"
				:other="otherDominanceValues"
				:class="classes.segments"
				:is-show-segments="isShowSegments"
				:is-show-indicator="props.displaySettings.isShowIndicator"
			/>
			<dominance-historical-grid
				v-if="isShowHistorical"
				:snapshots="sortedSnapshots"
				:other="otherDominanceValues"
				:is-show-today="!props.displaySettings.isShowIndicator"
				:class="classes.historical"
				:meta="props.meta"
			/>
		</div>
		<template
			v-if="props.displaySettings.isShowChart && meta.size.h > 5 && sortedSnapshots.length > 0"
		>
			<dominance-history-chart
				:meta="props.meta"
				:date-range="activeDateRange"
				:data="sortedSnapshots"
				:selected-tickers="props.selectedTickers"
				:class="classes.chart"
			/>
			<div :class="classes.rangeWrapper">
				<chart-range
					v-show="meta.size.h >= 8 && meta.size.w >=3"
					:active-range="activeChartRange"
					:list="chartRanges"
					disable-change
					@select="selectDateRange"
				/>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	gap: 16px;
}

.top {
	display: flex;
	column-gap: 40px;
	row-gap: 16px;
	padding: 10px 16px 16px;
	min-height: 0;
	overflow: hidden;
}

.top.column {
	flex-direction: column;
}

.top.wrap {
	flex-direction: row;
	flex-wrap: wrap;
}

.segments {
	flex: 1 1 auto;
	max-height: 165px;
}

.top.small .segments {
	min-height: 0;
}

.top:not(.column) .segments {
	align-self: flex-end;
}

.historical {
	flex-grow: 1;
	min-width: 300px;
	max-height: 165px;
	min-height: 0;
}

.chart {
	padding-right: 16px;
}

.rangeWrapper {
	margin-bottom: 10px;
	padding: 0 16px;
}
</style>
