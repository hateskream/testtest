<script setup lang="ts">
import { computed } from 'vue';

import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { TickerLinksWidget } from '@/modules/widgets/links';
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { useTickerContext } from '@/modules/ticker/composables';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { isFeatureEnabled } from '@/shared/lib';

const { tickerId } = useTickerContext();
const isShowTickerIndicators = computed(()=> isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED'));
const isShowActivityMetrics = computed(()=> isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'));
const isShowSection = computed(()=> isShowTickerIndicators.value || isShowActivityMetrics.value);
</script>

<template>
	<div v-if="isShowSection" :class="classes.section">
		<activity-metrics-ticker-widget :meta="{ tickerId }" />
		<base-ticker-widget-wrapper>
			<base-ticker-widget-header>Insights</base-ticker-widget-header>
			<base-ticker-widget-content>
				<ticker-key-indicators-widget :meta="{ tickerId }" />
			</base-ticker-widget-content>
		</base-ticker-widget-wrapper>
		<ticker-links-widget :meta="{ tickerId }" />
	</div>

</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
	overflow-y: hidden;
	scrollbar-width: none;
}
</style>
