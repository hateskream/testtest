<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { AnalystRatingsTickerWidget } from '@/modules/widgets/analyst-ratings';
import { ValuationMetricsTickerWidget } from '@/modules/widgets/valuation-metrics';
import { CapitalMetricsTickerWidget } from '@/modules/widgets/capital-metrics';
import { RevenueTickerWidget } from '@/modules/widgets/revenue';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const valuationMetricsIsEnabled = isFeatureEnabled('TICKER_WIDGET_VALUATION_METRICS_ENABLED');
const capitalStructureIsEnabled = isFeatureEnabled('TICKER_WIDGET_CAPITAL_STRUCTURE_ENABLED');
const revenueWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_REVENUE_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<div v-if="valuationMetricsIsEnabled || capitalStructureIsEnabled" :class="classes.metrics">
			<valuation-metrics-ticker-widget
				v-if="valuationMetricsIsEnabled"
				:meta="{ tickerId, name: 'Valuation Metrics' }"
				:class="classes.metricsItem"
			/>
			<capital-metrics-ticker-widget
				v-if="capitalStructureIsEnabled"
				:meta="{ tickerId, name: 'Capital Structure' }"
				:class="classes.metricsItem"
			/>
		</div>
		<analyst-ratings-ticker-widget :meta="{ tickerId, name: 'Analyst Ratings' }" />
		<revenue-ticker-widget v-if="revenueWidgetIsEnabled" :meta="{ tickerId, name: 'Revenue' }" />
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
