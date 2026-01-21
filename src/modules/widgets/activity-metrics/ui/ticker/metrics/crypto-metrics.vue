<script setup lang="ts">
import { computed } from 'vue';

import { UiTag } from '@/shared/ui/tag';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ActivityMetricsSentiment, type ICryptoActivityMetrics } from '../../../model';

import BaseMetrics from './base-metrics.vue';
import MetricsContainer from './metrics-container.vue';
import MetricsRow from './metrics-row.vue';

const props = defineProps<{
	metrics: ICryptoActivityMetrics;
}>();

const sentimentToColor = {
	[ActivityMetricsSentiment.BULLISH]: 'positive',
	[ActivityMetricsSentiment.BEARISH]: 'negative',
	[ActivityMetricsSentiment.NEUTRAL]: 'neutral',
} as const;

const sentimentToIcon = {
	[ActivityMetricsSentiment.BULLISH]: IconIds.Gainers,
	[ActivityMetricsSentiment.BEARISH]: IconIds.Loosers,
	[ActivityMetricsSentiment.NEUTRAL]: null,
} as const;

const sentimentColor = computed(() => sentimentToColor[props.metrics.sentiment]);
const sentimentIcon = computed(() => sentimentToIcon[props.metrics.sentiment]);
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
			<ui-tag :color="sentimentColor">
				<span>{{ props.metrics.sentiment }}</span>
				<template v-if="sentimentIcon" #icon>
					<ui-icon
						:id="sentimentIcon"
						height="8"
						width="8"
					/>
				</template>
			</ui-tag>
		</metrics-row>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
