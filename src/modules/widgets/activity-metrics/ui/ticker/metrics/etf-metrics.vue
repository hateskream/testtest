<script setup lang="ts">
import type { EtfActivityMetrics } from '../../../model';
import { TickerControlLink } from '@/modules/ticker/ui/base';
import { RouteNames } from '@/types/route.d';
import { MetricsContainer, MetricsRow } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface IEtfMetricsProps {
	metrics: EtfActivityMetrics;
}

const props = defineProps<IEtfMetricsProps>();
</script>

<template>
	<base-metrics>
		<metrics-container
			title="Market Cap"
			tooltip="Total market value of the ETF’s outstanding shares."
			:class="classes.full"
		>
			{{ props.metrics.marketCap }}
		</metrics-container>
		<metrics-container
			title="Avg. Volume"
			tooltip="Average daily trading volume over the past 30 to 90 days."
		>
			{{ props.metrics.avgVolume }}
		</metrics-container>
		<metrics-container title="Beta">
			<template #default>
				{{ props.metrics.beta }}
			</template>
			<template #tooltip>
				<div>
					<p>Measures the ETF’s volatility relative to its benchmark.</p>
					<p>1 = moves with the market;</p>
					<p>&gt;1 = more volatile;</p>
					<p>&lt;1 = less volatile</p>
				</div>
			</template>
		</metrics-container>
		<metrics-container
			title="Top Holding"
			tooltip="Percentage of total ETF assets invested in its largest position."
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
