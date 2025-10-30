<script setup lang="ts">
import { computed } from 'vue';

import { ChartAltcoinSeason } from '@/modules/lightweight-charts';
import type { IMeta } from '@/modules/dashboard-group';
import {
	ALTCOIN_PERFORMANCE_COLUMNS,
	type IAltcoinSeasonModules,
	type IChartData,
	type IHistoricalValue,
	type IPerformanceRank,
	type ITop100,
	type Period,
	periods,
} from '@/modules/widgets/altcoinSeason/model';

import BtcPerformance from '../btc-performance/btc-performance.vue';
import AltcoinSeasonLayout from './altcoin-season-layout.vue';
import AltcoinSeasonPeriodGroup from '../period-switch/altcoin-season-period-group.vue';
import HistoricalValue from '../historical-value/historical-value.vue';
import PerformanceTable from '../performance/performance-table.vue';

interface IAltcoinSeasonMainProps {
	meta: IMeta;
	performance: IPerformanceRank;
	historicalValues: IHistoricalValue;
	moduleSettings: IAltcoinSeasonModules;
	top100: ITop100;
	chart: IChartData;
}

const props = defineProps<IAltcoinSeasonMainProps>();

const period = defineModel<Period>('period', { required: true });

const rows = computed(() => props.top100.tickers.filter(t => !!t) ?? []);
</script>

<template>
	<altcoin-season-layout :size-by-cells="props.meta.size" :module-settings="props.moduleSettings">
		<template #period>
			<altcoin-season-period-group
				v-model:period="period"
				:period-list="periods"
			/>
		</template>

		<template #performanceRank>
			<btc-performance :performance="props.performance" />
		</template>

		<template #historicalValues>
			<historical-value :historical-values="props.historicalValues" />
		</template>

		<template #chart="{show, showX, showY}">
			<chart-altcoin-season
				:key="period"
				:btc-rank="props.performance.btcRank"
				:chart-data="props.chart"
				:show="show"
				:show-x="showX"
				:show-y="showY"
			/>
		</template>

		<template #top100>
			<keep-alive>
				<performance-table
					:rows="rows"
					:columns="ALTCOIN_PERFORMANCE_COLUMNS"
				/>
			</keep-alive>
		</template>

	</altcoin-season-layout>
</template>

<style module="classes">
.altcoinSeasonMain {
	display: flex;
}
</style>
