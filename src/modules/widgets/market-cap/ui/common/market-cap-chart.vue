<script setup lang="ts">
import { computed } from 'vue';

import { type IDisplaySettings, type IMarketCapHistory, type IMarketCapSummary, MarketCapDateRange } from '../../model';
import type { IMeta } from '@/modules/dashboard-group';
import { ChartMarketCap } from '@/modules/lightweight-charts';
import { RangeChart, type RangeChart as RangeChartType } from '@/shared/ui/chart-range';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';
import ChartRange from '@/shared/ui/chart-range/chart-range.vue';
import MarketCapChartTooltip from './market-cap-chart-tooltip.vue';

interface IMarketCapChartProps {
	meta: IMeta;
	data: IMarketCapHistory;
	summary?: IMarketCapSummary;
	displaySettings: IDisplaySettings;
	isShowRange?: boolean;
	isShowAxes?: boolean;
}

const props = defineProps<IMarketCapChartProps>();

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

const chartColorSchema = computed(() => props.summary && props.summary.change24h > 0 ? 'positive' : 'negative');

function selectDateRange(rangeChart: RangeChartType) {
	const dateRangeFilter = Object.entries(dateRangeToRangeChart)
		.find(([_, value]) => value === rangeChart);

	if (dateRangeFilter) {
		activeDateRange.value = dateRangeFilter[0] as MarketCapDateRange;
	}
}

const preparedDatasets = computed(() => {
	const { tickers } = props.data;

	return tickers.map(ticker => {
		return {
			label: ticker.symbol,
			color: ticker.color,
			points: props.data.data[ticker.symbol].market_caps.map(cap => ({ x: cap[0], y: cap[1] })),
		};
	});
});
</script>

<template>
	<div :class="[classes.root, {[classes.visibleAxis]: props.isShowAxes}]">
		<template v-if="props.data.tickers.length">
			<chart-market-cap
				:datasets="preparedDatasets"
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
		<template v-else-if="props.summary">
			<chart-component
				v-model:range="activeChartRange"
				:range-list="chartRanges"
				:is-visible-history-graph="false"
				:is-visible-indicators="false"
				:is-visible-price-line="isShowAxes"
				:is-visible-range="props.isShowRange"
				:is-visible-range-change="props.displaySettings.isShowChange"
				:is-visible-price-scale="isShowAxes"
				:is-visible-time-scale="isShowAxes"
				:is-padded-range="props.isShowRange"
				is-show-tooltip
				:width="100"
				height="100%"
				disable-scroll
				:color-schema="chartColorSchema"
			>
				<template #tooltipContent="{rows, title}">
					<market-cap-chart-tooltip
						v-if="rows.length"
						:title="title[0]"
						:color="rows[0].color"
						:value="rows[0].value"
					/>
				</template>
			</chart-component>
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
