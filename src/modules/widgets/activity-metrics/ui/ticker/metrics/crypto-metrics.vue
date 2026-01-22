<script setup lang="ts">
import { type ICryptoActivityMetrics } from '../../../model';
import { MetricsContainer, MetricsRow, MetricsSentiment } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface ICryptoMetricsProps {
	metrics: ICryptoActivityMetrics;
}

const props = defineProps<ICryptoMetricsProps>();
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
		<metrics-container title="Volume (24h)" tooltip="Tooltip">
			{{ props.metrics.volume24h }}
		</metrics-container>
		<metrics-container title="FDV" tooltip="Tooltip">
			{{ props.metrics.fdv }}
		</metrics-container>
		<metrics-container title="Vol/Mkt Cap (24h)" tooltip="Tooltip">
			{{ props.metrics.volToMktCap24h }}
		</metrics-container>
		<metrics-container title="Total Supply" tooltip="Tooltip">
			{{ props.metrics.totalSupply }}
		</metrics-container>
		<metrics-row title="Community Sentiment" :class="classes.full">
			<metrics-sentiment :sentiment="props.metrics.sentiment" />
		</metrics-row>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
