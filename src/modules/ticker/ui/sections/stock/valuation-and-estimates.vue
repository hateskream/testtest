<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { AnalystRatingsTickerWidget } from '@/modules/widgets/analyst-ratings';
import { RevenueTickerWidget } from '@/modules/widgets/revenue';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const revenueWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_REVENUE_ENABLED');
</script>

<template>
	<div :class="classes.section">
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
</style>
