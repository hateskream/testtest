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
} from '../../model';
import { Chart, ChartDateRange, ChartMarketCap } from '@/modules/lightweight-charts';
import type { DateRangeValue } from '@/modules/lightweight-charts/model';

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

const dateRange = defineModel<DateRangeValue>('dateRange', { required: true });

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
		return [];
	}

	const entityId = singleTargetEntity.value.id;

	return props.points.map((point): LineData => {
		return { time: point.timestamp / 1000, value: point.marketCap[entityId] };
	});
});
</script>

<template>
	<div :class="[classes.root, {[classes.visibleAxis]: props.isShowAxes}]">
		<template v-if="totalCount > 1">
			<chart-market-cap
				:datasets="preparedEntitiesDatasets"
				:range="dateRange"
				:hide-axis="!props.isShowAxes"
				height="100%"
			/>
			<div
				v-if="props.isShowRange"
				:class="[classes.rangeWrapper, {[classes.visibleAxis]: props.isShowAxes}]"
			>
				<chart-date-range v-model="dateRange" />
			</div>
		</template>
		<template v-else-if="singleTargetEntity">
			<chart
				:data="preparedSingleEntityDataset"
				:is-visible-price-line="isShowAxes"
				:is-visible-price-scale="isShowAxes"
				:is-visible-time-scale="isShowAxes"
				:color-schema="chartColorSchema"
				:right-offset-pixels="isShowAxes ? 100 : 0"
				height="100%"
				price-label="Current"
				is-show-tooltip
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
			<chart-date-range
				v-if="props.isShowRange"
				v-model="dateRange"
				:class="classes.range"
			/>
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

.range {
	flex-shrink: 0;
}
</style>
