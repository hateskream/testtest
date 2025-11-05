<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { type IDisplaySettings, type IMarketCapHistory, MarketCapDateRange } from '../../model';

import MarketCapTickersSummary from './market-cap-tickers-summary.vue';
import MarketCapSummary from './market-cap-summary.vue';
import MarketCapChart from './market-cap-chart.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IMarketCapHistory;
	displaySettings: IDisplaySettings;
	summaryClass?: string | string[];
	isShowChartRange?: boolean;
}

const props = defineProps<IViewComponentProps>();

const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

const isWide = computed(() => !props.displaySettings.isShowChart || props.meta.size.h <= 3);

// TODO: Вынести в апи, когда опишем конечные контракты
const mockedSummary = {
	marketCap: (1_000_000_000 + Math.random() * 2_000_000_000).toString(),
	volume: (1_000_000_000 + Math.random() * 2_000_000_000).toString(),
	change24h: -10 + Math.random() * 20,
};

const isShowChartAxes = computed(() => props.meta.size.w > 2 && props.meta.size.h > 7);
const chartRangeCanBeShowed = computed(() => props.meta.size.h > 7 && props.meta.size.w > 2);
</script>

<template>
	<div
		:class="[classes.root, {[classes.wide]: isWide}]"
	>
		<div :class="[classes.summaryWrapper, props.summaryClass]">
			<market-cap-tickers-summary v-if="props.data.tickers.length" :tickers="props.data.tickers" />
			<market-cap-summary
				v-else
				:meta="props.meta"
				:display-settings="props.displaySettings"
				:summary="mockedSummary"
			/>
		</div>
		<template v-if="props.displaySettings.isShowChart && props.meta.size.h > 3">
			<div :class="classes.chartWrapper">
				<market-cap-chart
					v-model:date-range="activeDateRange"
					:meta="props.meta"
					:data="props.data"
					:display-settings="props.displaySettings"
					:summary="mockedSummary"
					:is-show-range="props.isShowChartRange && chartRangeCanBeShowed"
					:is-show-axes="isShowChartAxes"
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
	gap: 16px;
}

.root.wide {
	justify-content: space-between;
}

.summaryWrapper {
	flex: 0 0 auto;
}

.chartWrapper {
	flex: 1;
	height: 100%;
	overflow: hidden;
}
</style>
