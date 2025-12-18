<script setup lang="ts">
import { computed } from 'vue';
import { LastPriceAnimationMode, type LineData } from '@shared/component-library';

import { Chart } from '@/modules/lightweight-charts';
import { type RangeChart as RangeChartType, RangeChart } from '@/shared/ui/chart-range';
import type { ICalendarEvent } from '@/modules/calendar';
import {
	getMarketSegmentStateColor,
	type IChartPriceCurrent,
	type IChartPricePoint,
	type IMarketSegment,
	TimeRangeFilterValue,
} from '../../model';

import ChartPriceHeader from './chart-price-header.vue';
import ChartPriceIndicators from './chart-price-indicators.vue';

interface IChartPriceProps {
	isBig: boolean;
	isShowAxes: boolean;
	isShowTimeRange: boolean;
	isShowChart?: boolean;
	isShowEventsTimeline?: boolean;
	displayVariant: 'tv' | 'dashboard';
	events?: ICalendarEvent[];
	marketSegments?: IMarketSegment[];
	points: IChartPricePoint[];
	current: IChartPriceCurrent;
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

const closeTime = computed(() => {
	return new Date(props.current.updatedAt);
});

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

const chartColorSchema = computed(() => props.current.changePercent > 0 ? 'positive' : 'negative');

const preparedChartData = computed(() => {
	return props.points.map((point): LineData => ({ time: point.timestamp / 1000, value: point.price }));
});

const indicators = computed(() => {
	return [{ title: 'Mainline', color: chartColorSchema.value === 'positive' ? '#04EDA0' : '#FC1D4D' }];
});
</script>

<template>
	<div :class="classes.root">
		<chart-price-header
			:price="props.current.price"
			:close-time="closeTime"
			:change-percent="props.current.changePercent"
			:change-delta="props.current.delta"
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
			<chart-price-indicators
				:indicators="indicators"
				:class="classes.indicators"
			/>
			<chart
				v-model:range="activeChartRange"
				:data="preparedChartData"
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
				:class="classes.chart"
				:events="props.events"
				:timeline-segments="timelineSegments"
				:events-timeline-padding="eventsTimelinePadding"
				:last-price-animation="LastPriceAnimationMode.Continuous"
				:color-schema="chartColorSchema"
				:right-offset-pixels="120"
				price-label="Current Price"
				fade-left
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
	display: flex;
	flex: 1 1 0;
	flex-direction: column;
	min-height: 0;
	gap: 10px;
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

.indicators {
	margin-right: 10px;
}

.chart {
	display: flex;
	flex: 1 1 0;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
