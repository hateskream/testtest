<script setup lang="ts">
import { computed, ref } from 'vue';

import { type IChartUpdateEmitData } from '@/modules/lightweight-charts/model';
import { type RangeChart as RangeChartType, RangeChart } from '@/shared/ui/chart-range';
import { randomFloat } from '@/shared/lib';
import type { ICalendarEvent } from '@/modules/calendar';
import { getMarketSegmentStateColor, type IMarketSegment, TimeRangeFilterValue } from '../../model';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';
import ChartPriceHeader from '@/modules/widgets/chart-price/ui/common/chart-price-header.vue';

interface IChartPriceProps {
	isBig: boolean;
	isShowAxes: boolean;
	isShowTimeRange: boolean;
	isShowChart?: boolean;
	isShowEventsTimeline?: boolean;
	displayVariant: 'tv' | 'dashboard';
	events?: ICalendarEvent[];
	marketSegments?: IMarketSegment[];
}

const props = withDefaults(defineProps<IChartPriceProps>(), {
	events: () => [],
	marketSegments: () => [],
});

const dateRange = defineModel<TimeRangeFilterValue>('range', { required: true });

const isTvDisplayVariant = computed(() => props.displayVariant === 'tv');

const eventsTimelinePadding = computed(() => {
	if (isTvDisplayVariant.value) {
		return props.isBig ? '0' : '0 16px 0 0';
	}

	return '0 20px 0 0';
});

const dateRangeToRangeChart: Record<TimeRangeFilterValue, RangeChartType> = {
	[TimeRangeFilterValue.Day]: RangeChart['1D'],
	[TimeRangeFilterValue.Week]: RangeChart['7D'],
	[TimeRangeFilterValue.Month]: RangeChart['1M'],
	[TimeRangeFilterValue.SixMonths]: RangeChart['6M'],
	[TimeRangeFilterValue.Year]: RangeChart['1Y'],
	[TimeRangeFilterValue.All]: RangeChart['ALL'],
};

const chartRanges = Object.values(TimeRangeFilterValue).map(key => dateRangeToRangeChart[key]);

const activeChartRange = computed({
	get: () => dateRangeToRangeChart[dateRange.value],
	set: (newRange) => {
		const dateRangeFilter = Object.entries(dateRangeToRangeChart)
			.find(([_, value]) => value === newRange);

		if (dateRangeFilter) {
			dateRange.value = dateRangeFilter[0] as TimeRangeFilterValue;
		}
	},
});

const currentPrice = ref<IChartUpdateEmitData>({
	value: randomFloat(0, 10),
	time: new Date(),
});

// TODO: Внедрить данные из API
const generatedChangeData = computed(() => {
	const change = randomFloat(-2, 2);

	return {
		value: change,
		percent: change / currentPrice.value.value * 100,
	};
});

function handleUpdateData(data: IChartUpdateEmitData) {
	currentPrice.value = data;
}

const timelineSegments = computed(() => {
	return props.marketSegments.map(segment => {
		return {
			from: segment.from,
			to: segment.to,
			title: segment.title,
			color: getMarketSegmentStateColor(segment.state),
		};
	});
});

</script>

<template>
	<div :class="classes.root">
		<chart-price-header
			:price="currentPrice.value"
			:close-time="currentPrice.time"
			:change="generatedChangeData"
			:show-time="isTvDisplayVariant"
			:class="[classes.header, {
				[classes.tv]: isTvDisplayVariant
			}]"
		/>
		<div
			v-if="isShowChart"
			:class="[classes.chartWrapper, {
				[classes.full]: props.isBig,
				[classes.tv]: isTvDisplayVariant
			}]"
		>
			<chart-component
				v-model:range="activeChartRange"
				width="100%"
				height="100%"
				is-show-tooltip
				:is-visible-history-graph="false"
				:disable-scroll="false"
				:is-visible-indicators="false"
				:is-visible-range="props.isBig && props.isShowTimeRange"
				:is-visible-price-line="props.isShowAxes"
				:is-visible-price-scale="props.isShowAxes"
				:is-visible-time-scale="props.isShowAxes && !props.isShowEventsTimeline"
				:is-visible-events-timeline="props.isShowEventsTimeline"
				:range-list="chartRanges"
				:right-offset-pixels="20"
				:class="classes.chart"
				:events="props.events"
				:timeline-segments="timelineSegments"
				:events-timeline-padding="eventsTimelinePadding"
				fade-left
				@update="handleUpdateData"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.header.tv {
	margin: 0 16px;
}

.header:not(.tv) {
	margin: 0 20px;
}

.chartWrapper {
	flex: 1 1 0;
	min-height: 0;
	padding: 0 0 12px 20px;

	&.tv {
		padding: 0 0 16px 16px;
	}

	&.full {
		padding-left: 20px;
	}

	&.full.tv {
		padding: 0 16px 16px;
	}
}

.chart {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
