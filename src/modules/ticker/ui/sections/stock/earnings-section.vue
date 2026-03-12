<script setup lang="ts">
import { isFeatureEnabled } from '@/shared/lib';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { TickerPriceToEarningsWidget } from '@/modules/widgets/price-to-earnings';
import { EpsTilesTickerWidget } from '@/modules/widgets/eps-tiles';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const epsTilesIsEnabled = isFeatureEnabled('TICKER_WIDGET_EPS_TILES_ENABLED');
const priceToEarningsIsEnabled = isFeatureEnabled('TICKER_WIDGET_PRICE_TO_EARNINGS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<eps-tiles-ticker-widget v-if="epsTilesIsEnabled" :meta="{ tickerId, name: 'EPS' }" />
		<ticker-price-to-earnings-widget v-if="priceToEarningsIsEnabled" :meta="{ tickerId, name: 'P/E' }" />
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
