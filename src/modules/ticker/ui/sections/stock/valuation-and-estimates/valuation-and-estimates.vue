<script setup lang="ts">
import { markRaw, ref } from 'vue';

import { RevenueTickerWidget } from '@/modules/widgets/revenue';
import { ValuationMetricsTickerWidget } from '@/modules/widgets/valuation-metrics';
import { CapitalMetricsTickerWidget } from '@/modules/widgets/capital-metrics';
import { isFeatureEnabled } from '@/shared/lib';
import { TickerBaseTabsLayout } from '../../../base';
import { useTickerContext } from '../../../../composables';
import type { ISectionItem } from '../../../../models';

import TabAnalystRatings from './tab-analyst-ratings.vue';
import TabPriceTarget from './tab-price-target.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const tabs = [
	{ id: 'price-target', title: 'Price Target', component: markRaw(TabPriceTarget) },
	{ id: 'analyst-ratings', title: 'Analyst Ratings', component: markRaw(TabAnalystRatings) },
];

const selectedTabId = ref('price-target');

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
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs" />
		<revenue-ticker-widget v-if="revenueWidgetIsEnabled" :meta="{ tickerId, name: 'Revenue' }" />
	</div>
	<div :class="classes.section">
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs" />
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
