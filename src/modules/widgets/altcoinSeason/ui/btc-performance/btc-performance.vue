<script setup lang="ts">
import BtcPerformanceHeading from './btc-performance-heading.vue';
import BtcPerformanceSeason from './btc-performance-season.vue';
import BtcPerformanceChart from './btc-performance-chart.vue';

interface IBtcPerformanceProps {
	showPeriod: boolean;
}

const props = defineProps<IBtcPerformanceProps>();
</script>

<template>
	<div :class="classes.btcPerformance">
		<btc-performance-heading :show-period="props.showPeriod" />
		<btc-performance-season />
		<btc-performance-chart />
	</div>
</template>

<style module="classes">
.btcPerformance {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	padding: 12px 8px;
	gap: 12px;
	color: var(--color-text-base-300, #9a9a9d);
}

</style>
