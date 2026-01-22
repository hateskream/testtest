<script setup lang="ts">
import type { IForexActivityMetrics } from '../../../model';
import { MetricsContainer } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface IForexMetricsProps {
	metrics: IForexActivityMetrics;
}

const props = defineProps<IForexMetricsProps>();
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
