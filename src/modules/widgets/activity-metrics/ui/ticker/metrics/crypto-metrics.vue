<script setup lang="ts">
import { type CryptoActivityMetrics } from '../../../model';
import { MetricsContainer, MetricsRow, MetricsSentiment } from '../../common';

import BaseMetrics from './base-metrics.vue';

export interface ICryptoMetricsProps {
	metrics: CryptoActivityMetrics;
}

const props = defineProps<ICryptoMetricsProps>();
</script>

<template>
	<base-metrics>
		<metrics-container
			title="Market Cap"
			tooltip="Circulating supply × current price. Shows the total market value of the cryptocurrency."
			:class="classes.full"
		>
			{{ props.metrics.marketCap }}
		</metrics-container>
		<metrics-container
			title="Volume (24h)"
			tooltip="Total amount traded in the last 24 hours. Reflects short-term activity and liquidity."
		>
			{{ props.metrics.volume24h }}
		</metrics-container>
		<metrics-container
			title="FDV"
			tooltip="Fully Diluted Valuation = Maximum supply × current price.
			Shows the market value if all tokens were in circulation."
		>
			{{ props.metrics.fdv }}
		</metrics-container>
		<metrics-container
			title="Vol/Mkt Cap (24h)"
			tooltip="24h trading volume ÷ market cap. Shows how actively the asset is traded relative to its size."
		>
			{{ props.metrics.volToMktCap24h }}
		</metrics-container>
		<metrics-container
			title="Total Supply"
			tooltip="Total tokens created minus burned tokens, including those not currently in circulation."
		>
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
