<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';
import type { LineData } from '@shared/component-library';

import {
	type IDisplaySettings,
	type IMarketCapMarket,
	type IMarketCapPoint,
	type IMarketCapTicker,
	type IMarketCapTotal,
	type IMarketCapTotalValue,
	MarketCapDateRange,
} from '../../model';
import { Chart, ChartMarketCap } from '@/modules/lightweight-charts';
import { ChartRange, type RangeChart as RangeChartType, RangeChart } from '@/shared/ui/chart-range';

import MarketCapChartTooltip from './market-cap-chart-tooltip.vue';

interface IMarketCapChartProps {
	markets: IMarketCapMarket[];
	tickers: IMarketCapTicker[];
	points: IMarketCapPoint[];
	total: IMarketCapTotal;
	displaySettings: IDisplaySettings;
	isShowRange?: boolean;
	isShowAxes?: boolean;
}

const props = defineProps<IMarketCapChartProps>();

// date range

const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

const dateRangeToRangeChart: Record<MarketCapDateRange, RangeChartType> = {
	[MarketCapDateRange.Day]: RangeChart['1D'],
	[MarketCapDateRange.Week]: RangeChart['7D'],
	[MarketCapDateRange.Month]: RangeChart['1M'],
	[MarketCapDateRange.SixMonths]: RangeChart['6M'],
	[MarketCapDateRange.Year]: RangeChart['1Y'],
	[MarketCapDateRange.All]: RangeChart['ALL'],
};

const chartRanges = Object.values(MarketCapDateRange).map(key => dateRangeToRangeChart[key]);

const activeChartRange = computed({
	get: () => dateRangeToRangeChart[activeDateRange.value],
	set: (newRange) => {
		const dateRangeFilter = Object.entries(dateRangeToRangeChart)
			.find(([_, value]) => value === newRange);

		if (dateRangeFilter) {
			activeDateRange.value = dateRangeFilter[0] as MarketCapDateRange;
		}
	},
});

function selectDateRange(rangeChart: RangeChartType) {
	const dateRangeFilter = Object.entries(dateRangeToRangeChart)
		.find(([_, value]) => value === rangeChart);

	if (dateRangeFilter) {
		activeDateRange.value = dateRangeFilter[0] as MarketCapDateRange;
	}
}

// target entity

const totalCount = computed(() => props.markets.length + props.tickers.length);

const singleTargetEntity = computed(() => {
	if (totalCount.value > 1) {
		return null;
	}

	return props.markets.length > 0 ? props.markets[0] : props.tickers[0];
});

// total

const singleTotalValue = computed(() => {
	if (!singleTargetEntity.value) {
		return null;
	}

	const entityId = singleTargetEntity.value.id;

	return {
		marketCap: props.total.marketCap[entityId],
		volume: props.total.volume[entityId],
		changePercent: props.total.changePercent[entityId],
	} as IMarketCapTotalValue;
});

// dataset

const chartColorSchema = computed(() => singleTotalValue.value
	&& singleTotalValue.value.changePercent > 0 ? 'positive' : 'negative');

const preparedEntitiesDatasets = computed(() => {
	const preparedTickers = props.tickers.map(ticker => {
		return {
			label: ticker.symbol,
			color: ticker.color,
			points: props.points.map(point => ({ x: point.timestamp, y: point.marketCap[ticker.id] }))
				.filter(point => notNullish(point.y)),
		};
	});

	const preparedMarkets = props.markets.map(market => {
		return {
			label: market.id,
			color: market.color,
			points: props.points.map(point => ({ x: point.timestamp, y: point.marketCap[market.id] }))
				.filter(point => notNullish(point.y)),
		};
	});

	return [...preparedTickers, ...preparedMarkets];
});

const preparedSingleEntityDataset = computed(() => {
	if (!singleTargetEntity.value) {
		return null;
	}

	const entityId = singleTargetEntity.value.id;

	return props.points.map((point): LineData => {
		return { time: point.timestamp, value: point.marketCap[entityId] };
	});
});
</script>

<template>
	<div :class="[classes.root, {[classes.visibleAxis]: props.isShowAxes}]">
		<template v-if="totalCount > 1">
			<chart-market-cap
				:datasets="preparedEntitiesDatasets"
				:range="activeDateRange"
				:hide-axis="!props.isShowAxes"
				height="100%"
			/>
			<div
				v-if="props.isShowRange"
				:class="[classes.rangeWrapper, {[classes.visibleAxis]: props.isShowAxes}]"
			>
				<chart-range
					:active-range="activeChartRange"
					:list="chartRanges"
					disable-change
					@select="selectDateRange"
				/>
			</div>
		</template>
		<template v-else-if="singleTargetEntity">
			<chart
				v-model:range="activeChartRange"
				:data="preparedSingleEntityDataset"
				:range-list="chartRanges"
				:is-visible-history-graph="false"
				:is-visible-indicators="false"
				:is-visible-price-line="isShowAxes"
				:is-visible-range="props.isShowRange"
				:is-visible-range-change="props.displaySettings.isShowChange"
				:is-visible-price-scale="isShowAxes"
				:is-visible-time-scale="isShowAxes"
				:width="100"
				:color-schema="chartColorSchema"
				is-show-tooltip
				height="100%"
				disable-scroll
				fade-left
			>
				<template #tooltipContent="{rows, title}">
					<market-cap-chart-tooltip
						v-if="rows.length"
						:title="title[0]"
						:color="rows[0].color"
						:value="rows[0].value"
					/>
				</template>
			</chart>
		</template>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.rangeWrapper {
	padding: 16px 16px 10px;
}

.rangeWrapper.visibleAxis {
	padding-right: 0;
}

.root.visibleAxis {
	padding-right: 16px;
}
</style>
