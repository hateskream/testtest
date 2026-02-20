<script setup lang="ts">
import type { ForexActivityMetrics } from '../../../model';
import { MetricsContainer } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface IForexMetricsProps {
	metrics: ForexActivityMetrics;
}

const props = defineProps<IForexMetricsProps>();
</script>

<template>
	<base-metrics>
		<metrics-container
			title="Volume (24h)"
			tooltip="Total traded volume of a currency pair across the global market over the past 24 hours"
			:class="classes.full"
		>
			{{ props.metrics.volume24h }}
		</metrics-container>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
