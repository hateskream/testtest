<script setup lang="ts">
import { computed } from 'vue';

import { PerformanceWidget } from '@/modules/widgets/performance';
import { ChartAltcoinSeason } from '@/modules/lightweight-charts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import {
	type IAltcoinSeasonConfig,
	type IHistoricalValue,
	type IPerformanceRank,
	type Period,
	periods,
} from '@/modules/widgets/altcoinSeason/model';

import BtcPerformance from '../btc-performance/btc-performance.vue';
import AltcoinSeasonLayout from './altcoin-season-layout.vue';
import AltcoinSeasonPeriodGroup from '../period-switch/altcoin-season-period-group.vue';
import HistoricalValue from '../historical-value/historical-value.vue';

interface IAltcoinSeasonMainProps {
	meta: IMeta;
	performance: IPerformanceRank;
	historicalValues: IHistoricalValue;
	widgetDisplaySettings: IAltcoinSeasonConfig['modules'];
}

const props = defineProps<IAltcoinSeasonMainProps>();

const metaPerformance = computed(() => {
	return {
		...props.meta,
		name: 'Top 100 coins performance',
	};
});

const period = defineModel<Period>('period', { required: true });
</script>

<template>
	<altcoin-season-layout :size-by-cells="props.meta.size" :widget-display-settings="props.widgetDisplaySettings">
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

		<template #chart="{showX, showY}">
			<chart-altcoin-season :show-x="showX" :show-y="showY" />
		</template>

		<template #top100>
			<performance-widget :meta="metaPerformance" />
		</template>

	</altcoin-season-layout>
</template>

<style module="classes">
.altcoinSeasonMain {
	display: flex;
}
</style>
