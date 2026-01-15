<script setup lang="ts">
import { computed } from 'vue';
import { add, endOfDay, startOfDay, sub } from 'date-fns';

import type { IMeta } from '@/modules/dashboard-group';
import {
	type IChartPriceCurrent,
	type IChartPricePoint,
	TimeRangeFilterValue,
} from '@/modules/widgets/chart-price/model';
import { EventType, type ICalendarEvent, Impact, MarketIds } from '@/modules/calendar';
import { randomInt } from '@/shared/lib';
import { type IMarketSegment, isTimelineEventsVisible, MarketSegmentState } from '../../model';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	meta: IMeta;
	isShowTimeRange: boolean;
	displayVariant: 'tv' | 'dashboard';
	points: IChartPricePoint[];
	current: IChartPriceCurrent;
}

const props = defineProps<IViewComponentProps>();

const dateRange = defineModel<TimeRangeFilterValue>('range', { required: true });

const isBig = computed(() => props.meta.size.h >= 6 && props.meta.size.w >= 2);
const isShowChart = computed(() => props.meta.size.h > 3);
const isShowAxes = computed(() => props.meta.size.h >= 5 && props.meta.size.w >= 3);

const isShowChatEventsTimeline = computed(() => {
	return isTimelineEventsVisible(dateRange.value) && props.meta.size.h >= 5 && props.meta.size.w >= 3;
});

const isTvDisplayVariant = computed(() => props.displayVariant === 'tv');

// TODO: Change to props data
function generateMock(from: number, to: number, count: number) {
	const diff = (to - from) / count;

	let time = from + diff;

	return Array.from({ length: count }).map((_, key) => {
		const currentTime = time + randomInt(0, diff);
		time += diff;

		return {
			id: key.toString(),
			meta: {
				title: 'S&P 500 Economic',
				description: '',
				datetime: (new Date(currentTime)).toJSON(),
				image: randomInt(-1, 1) > 0 ? '/mock/widgets/price-chart/usa.svg' : '',
				category: EventType.Economic,
				country: MarketIds.USA,
				impact: Impact.Medium,
			},
			canonical_ticker_id: 'Stock-AMZW',
			metrics: [],
		} as ICalendarEvent;
	});
}

const mockedEvents: ICalendarEvent[] = generateMock(
	sub(new Date(), { days: 2 }).getTime(),
	sub(endOfDay(new Date()), { hours: 2 }).getTime(),
	50,
);

const mockedMarketSegments: IMarketSegment[] = [
	{
		from: startOfDay(new Date()).getTime(),
		to: add(startOfDay(new Date()), { hours: 5 }).getTime(),
		title: 'Market Close',
		state: MarketSegmentState.CLOSE,
	},
	{
		from: add(startOfDay(new Date()), { hours: 5 }).getTime(),
		to: sub(endOfDay(new Date()), { hours: 2 }).getTime(),
		title: 'Market Open',
		state: MarketSegmentState.OPEN,
	},
	{
		from: sub(endOfDay(new Date()), { hours: 2 }).getTime(),
		to: endOfDay(new Date()).getTime(),
		title: 'Market Close',
		state: MarketSegmentState.CLOSE,
	},
];
</script>

<template>
	<div :class="classes.root">
		<div v-if="$slots.filters" :class="{ [classes.filters]: isTvDisplayVariant }">
			<slot name="filters" />
		</div>
		<chart-price
			v-model:range="dateRange"
			:display-variant="props.displayVariant"
			:is-big="isBig"
			:is-show-chart="isShowChart"
			:is-show-time-range="props.isShowTimeRange && props.meta.size.w > 2"
			:is-show-axes="isShowAxes"
			:is-show-events-timeline="isShowChatEventsTimeline"
			:current="props.current"
			:points="props.points"
			:class="classes.chart"
			:events="mockedEvents"
			:market-segments="mockedMarketSegments"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
}

.filters {
	padding: 0 16px;
}
</style>
