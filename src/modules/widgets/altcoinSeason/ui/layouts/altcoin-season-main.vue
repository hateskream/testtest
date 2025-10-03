<script setup lang="ts">
import { computed } from 'vue';

import { PerformanceWidget } from '@/modules/widgets/performance';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';
import { ChartAltcoinSeason } from '@/modules/lightweight-charts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { periods } from '@/modules/widgets/altcoinSeason/model';

import BtcPerformance from '../btc-performance/btc-performance.vue';
import AltcoinSeasonLayout from './altcoin-season-layout.vue';
import AltcoinSeasonPeriodGroup from '../period-switch/altcoin-season-period-group.vue';
import HistoricalValue from '../historical-value/historical-value.vue';

const altcoinSeasonStore = useAltcoinSeasonStore();

interface IAltcoinSeasonMainProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonMainProps>();

const metaPerformance = computed(() => {
	return {
		...props.meta,
		name: 'Top 100 coins performance',
	};
});
</script>

<template>
	<altcoin-season-layout :size-by-cells="props.meta.size">
		<template #period>
			<altcoin-season-period-group
				v-model:selected-period="altcoinSeasonStore.period.value"
				:period-list="periods"
				@update:selected-period="altcoinSeasonStore.handlePeriodChange($event)"
			/>
		</template>

		<template #performanceRank="{ showPeriod }">
			<btc-performance :show-period="showPeriod" />
		</template>

		<template #historicalValues="{ showPeriod }">
			<historical-value :show-period="showPeriod" />
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
