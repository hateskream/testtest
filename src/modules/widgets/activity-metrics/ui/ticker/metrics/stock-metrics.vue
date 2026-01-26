<script setup lang="ts">
import { TickerControlLink } from '@/modules/widgets/base/ticker';
import { RouteNames } from '@/types/route.d';
import type { StockActivityMetrics } from '../../../model';
import { MetricsContainer, MetricsRow } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface IStockMetricsProps {
	metrics: StockActivityMetrics;
}

const props = defineProps<IStockMetricsProps>();
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
		<metrics-container title="Volume" tooltip="Tooltip">
			{{ props.metrics.volume24h }}
		</metrics-container>
		<metrics-container title="Total Return (3M)" tooltip="Tooltip">
			{{ props.metrics.totalReturn3m }}
		</metrics-container>
		<metrics-container title="Total Return (1Y)" tooltip="Tooltip">
			{{ props.metrics.totalReturn1y }}
		</metrics-container>
		<metrics-container title="Forward P/E" tooltip="Tooltip">
			{{ props.metrics.forwardPe }}
		</metrics-container>
		<metrics-row title="Sector" :class="classes.full">
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
