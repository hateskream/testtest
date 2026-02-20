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
			tooltip="Total market value of the circulating supply. Market Capitalization = Circulating Supply × Current Price."
			:class="classes.full"
		>
			{{ props.metrics.marketCap }}
		</metrics-container>
		<metrics-container
			title="Volume (24h)"
			tooltip="Total trading volume across tracked exchanges in the last 24 hours.
			Indicates short-term market activity and liquidity."
		>
			{{ props.metrics.volume24h }}
		</metrics-container>
		<metrics-container title="FDV">
			<template #default>{{ props.metrics.fdv }}</template>
			<template #tooltip>
				<div>
					<p>Market value assuming the maximum possible supply is in circulation.</p>
					<p>FDV = Maximum Supply × Current Price</p>
				</div>
			</template>
		</metrics-container>
		<metrics-container
			title="Vol/Mkt Cap (24h)"
			tooltip="24h trading volume divided by market cap. Shows relative liquidity and
			turnover compared to the asset’s size."
		>
			{{ props.metrics.volToMktCap24h }}
		</metrics-container>
		<metrics-container
			title="Total Supply"
			tooltip="Total number of coins/tokens created minus burned tokens,
			including those not currently in circulation."
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
