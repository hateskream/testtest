<script setup lang="ts">
import type { IEtfActivityMetrics } from '../../../model';
import { TickerControlLink } from '@/modules/widgets/base/ticker';
import { RouteNames } from '@/types/route.d';

import BaseMetrics from './base-metrics.vue';
import MetricsContainer from './metrics-container.vue';
import MetricsRow from './metrics-row.vue';

const props = defineProps<{
	metrics: IEtfActivityMetrics;
}>();
</script>

<template>
	<base-metrics>
		<metrics-container
			title="Market Cap"
			tooltip="Tooltip"
			:class="classes.full"
		>
			{{ props.metrics.marketCap }}
		</metrics-container>
		<metrics-container title="Avg. Volume" tooltip="Tooltip">
			{{ props.metrics.avgVolume }}
		</metrics-container>
		<metrics-container title="Beta" tooltip="Tooltip">
			{{ props.metrics.beta }}
		</metrics-container>
		<metrics-container
			title="Top Holding"
			tooltip="Tooltip"
			:class="classes.full"
		>
			{{ props.metrics.topHolding }}
		</metrics-container>
		<metrics-row title="Number of sectors" :class="classes.full">
			<ticker-control-link :to="{ name: RouteNames.Home }">
				{{ props.metrics.numSectors }}
			</ticker-control-link>
		</metrics-row>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
