<script setup lang="ts">
import type { ICommodityActivityMetrics } from '../../../model';

import BaseMetrics from './base-metrics.vue';
import MetricsContainer from './metrics-container.vue';

const props = defineProps<{
	metrics: ICommodityActivityMetrics;
}>();
</script>


<template>
	<base-metrics>
		<metrics-container
			title="Volume (24H)"
			tooltip="Tooltip"
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
