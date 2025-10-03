<script setup lang="ts">
import type { IPerformanceRank } from '@/modules/widgets/altcoinSeason/model';

import BtcPerformanceSeason from './btc-performance-season.vue';
import BtcPerformanceChart from './btc-performance-chart.vue';
import AltcoinHeading from '../shared/altcoin-heading.vue';

const props = defineProps<{
	performance: IPerformanceRank;
}>();
</script>

<template>
	<div :class="classes.btcPerformance">
		<altcoin-heading>
			Btc performance
		</altcoin-heading>
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
	padding: 6px 16px 15px;
	color: var(--color-text-base-300, #9a9a9d);
}

.bottom {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>
