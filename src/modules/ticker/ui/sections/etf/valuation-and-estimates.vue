<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { ValuationMetricsTickerWidget } from '@/modules/widgets/valuation-metrics';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const valuationMetricsIsEnabled = isFeatureEnabled('TICKER_WIDGET_VALUATION_METRICS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<div v-if="valuationMetricsIsEnabled" :class="classes.metrics">
			<valuation-metrics-ticker-widget
				:meta="{ tickerId, name: 'Valuation Metrics' }"
				:class="classes.metricsItem"
			/>
		</div>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	container-type: inline-size;
	container-name: root;
}

.metrics {
	display: flex;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: 6px;
}

.metricsItem {
	height: 250px;
}

@container root (width > 580px) {
	.metricsItem {
		flex: 1 0 0;
	}
}

@container root (width < 580px) {
	.metrics {
		flex-direction: column;
	}
}
</style>
