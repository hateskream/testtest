<script setup lang="ts">
import type { IPerformanceRank } from '@/modules/widgets/altcoinSeason/model';

import BtcPerformanceHeading from './btc-performance-heading.vue';
import BtcPerformanceSeason from './btc-performance-season.vue';
import BtcPerformanceChart from './btc-performance-chart.vue';

const props = defineProps<{
	performance: IPerformanceRank;
}>();
</script>

<template>
	<div :class="classes.btcPerformance">
		<btc-performance-heading />
		<div :class="classes.bottom">
			<btc-performance-season :performance="props.performance" />
			<btc-performance-chart :performance="props.performance" />
		</div>
	</div>
</template>

<style module="classes">
.btcPerformance {
	display: flex;
	flex-direction: column;
	gap: 9px;
	padding: 6px 16px 26px;
	color: var(--color-text-base-300, #9a9a9d);
}

.bottom {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>
