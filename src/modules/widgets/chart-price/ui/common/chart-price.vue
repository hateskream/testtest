<script setup lang="ts">
import { computed } from 'vue';
import { LastPriceAnimationMode } from '@shared/component-library';

import { Chart, ChartDateRange } from '@/modules/lightweight-charts';
import { type DateRangeValue, strTimeToChartTime } from '@/modules/lightweight-charts/model';
import type { ICalendarEvent } from '@/modules/calendar';
import {
	type ChartPriceCurrentData,
	type ChartPriceHistoryPoint,
	getMarketSegmentStateColor,
	type IMarketSegment,
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
	points: ChartPriceHistoryPoint[];
	current: ChartPriceCurrentData;
}

const props = withDefaults(defineProps<IChartPriceProps>(), {
	events: () => [],
	marketSegments: () => [],
});

const dateRange = defineModel<DateRangeValue>('range', { required: true });

const isTvDisplayVariant = computed(() => props.displayVariant === 'tv');

const eventsTimelinePadding = computed(() => {
	if (isTvDisplayVariant.value) {
		return props.isBig ? '0' : '0 16px 0 0';
	}

	return '0 20px 0 0';
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
	return props.points.map(point => ({
		time: strTimeToChartTime(point.timestamp),
		open: point.priceCandle.open,
		high: point.priceCandle.high,
		low: point.priceCandle.low,
		close: point.priceCandle.close,
	}));
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
				:data="preparedChartData"
				height="100%"
				is-show-tooltip
				:is-visible-price-line="props.isShowAxes"
				:is-visible-price-scale="props.isShowAxes"
				:is-visible-time-scale="props.isShowAxes && !props.isShowEventsTimeline"
				:is-visible-events-timeline="props.isShowEventsTimeline"
				:class="classes.chart"
				:events="props.events"
				:timeline-segments="timelineSegments"
				:events-timeline-padding="eventsTimelinePadding"
				:last-price-animation="LastPriceAnimationMode.Continuous"
				:color-schema="chartColorSchema"
				:prev-close-price="props.current.prevClosePrice"
				:right-offset-pixels="120"
				price-label="Current Price"
				fade-left
			/>
			<chart-date-range v-if="props.isBig && props.isShowTimeRange" v-model="dateRange" />
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
