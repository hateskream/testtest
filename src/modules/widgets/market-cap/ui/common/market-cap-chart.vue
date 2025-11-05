<script setup lang="ts">
import { computed } from 'vue';

import { type IDisplaySettings, type IMarketCapHistory, type IMarketCapSummary, MarketCapDateRange } from '../../model';
import type { IMeta } from '@/modules/dashboard-group';
import { ChartMarketCap } from '@/modules/lightweight-charts';
import { RangeChart, type RangeChart as RangeChartType } from '@/shared/ui/chart-range';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';
import ChartRange from '@/shared/ui/chart-range/chart-range.vue';

interface IMarketCapChartProps {
	meta: IMeta;
	data: IMarketCapHistory;
	summary?: IMarketCapSummary;
	displaySettings: IDisplaySettings;
}

const props = defineProps<IMarketCapChartProps>();

const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

const dateRangeToRangeChart: Record<MarketCapDateRange, RangeChartType> = {
	[MarketCapDateRange.Day]: RangeChart['1D'],
	[MarketCapDateRange.Week]: RangeChart['7D'],
	[DominanceDateRange.Month]: RangeChart['1M'],
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

const isShowChartRange = computed(() => props.meta.size.h > 7 && props.meta.size.w > 2);
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

const isHideAxis = computed(() => props.meta.size.w <= 2 || props.meta.size.h <= 7);
</script>

<template>
	<div :class="[classes.root, {[classes.visibleAxis]: !isHideAxis}]">
		<template v-if="props.data.tickers.length">
			<chart-market-cap
				:datasets="preparedDatasets"
				:range="activeDateRange"
				:hide-axis="isHideAxis"
				height="100%"
			/>
			<div
				v-if="meta.size.h >= 8 && meta.size.w >= 3"
				:class="[classes.rangeWrapper, {[classes.visibleAxis]: !isHideAxis}]"
			>
				<chart-range
					:active-range="activeChartRange"
					:list="chartRanges"
					disable-change
					@select="selectDateRange"
				/>
			</div>
		</template>
		<chart-component
			v-else-if="props.summary"
			v-model:range="activeChartRange"
			:range-list="chartRanges"
			:is-visible-history-graph="false"
			:is-visible-indicators="false"
			:is-visible-range="isShowChartRange"
			:is-visible-range-change="props.displaySettings.isShowChange"
			:is-padded-range="isShowChartRange"
			:width="100"
			height="100%"
			disable-scroll
			:color-schema="chartColorSchema"
		/>
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
