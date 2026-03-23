<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { type IDisplaySettings, type IMarketCapHistory } from '../../model';
import type { DateRangeValue } from '@/modules/charts/common/model';

import MarketCapTotal from './market-cap-total.vue';
import MarketCapChart from './market-cap-chart.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IMarketCapHistory;
	displaySettings: IDisplaySettings;
	summaryClass?: string | string[];
	isShowChartRange?: boolean;
}

const props = defineProps<IViewComponentProps>();

const activeDateRange = defineModel<DateRangeValue>('dateRange', { required: true });

const isWide = computed(() => !props.displaySettings.isShowChart || props.meta.size.h <= 3);

const isShowChartAxes = computed(() => props.meta.size.w > 2 && props.meta.size.h > 7);
const chartRangeCanBeShowed = computed(() => props.meta.size.h > 7 && props.meta.size.w > 2);

const tickers = computed(() => props.data.tickers ?? []);
const markets = computed(() => props.data.markets ?? []);
const total = computed(() => props.data.data.total ?? {});
</script>

<template>
	<div :class="[classes.root, {[classes.wide]: isWide}]">
		<market-cap-total
			:meta="props.meta"
			:display-settings="props.displaySettings"
			:tickers="tickers"
			:markets="markets"
			:total="total"
			:class="[classes.summaryWrapper, props.summaryClass]"
		/>
		<template v-if="props.displaySettings.isShowChart && props.meta.size.h > 3">
			<div :class="classes.chartWrapper">
				<market-cap-chart
					v-model:date-range="activeDateRange"
					:meta="props.meta"
					:display-settings="props.displaySettings"
					:tickers="tickers"
					:markets="markets"
					:total="total"
					:points="props.data.data.points"
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
	gap: 12px;
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
