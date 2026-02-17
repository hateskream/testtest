<script setup lang="ts">
import type { CommodityActivityMetrics } from '../../../model';
import { MetricsContainer } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface ICommodityMetricsProps {
	metrics: CommodityActivityMetrics;
}

const props = defineProps<ICommodityMetricsProps>();
</script>


<template>
	<base-metrics>
		<metrics-container
			title="Volume (24h)"
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
