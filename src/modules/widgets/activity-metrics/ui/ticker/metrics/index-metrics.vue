<script setup lang="ts">
import { RouteNames } from '@/types/route.d';
import { TickerControlLink } from '@/modules/widgets/base/ticker';
import type { IIndexActivityMetrics } from '../../../model';
import { MetricsContainer, MetricsRow } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface IIndexMetricsProps {
	metrics: IIndexActivityMetrics;
}

const props = defineProps<IIndexMetricsProps>();
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
		<metrics-row
			v-if="props.metrics.sector"
			title="Sectors"
			:class="classes.full"
		>
			<ticker-control-link :to="{ name: RouteNames.Home }">
				{{ props.metrics.sector }}
			</ticker-control-link>
		</metrics-row>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
