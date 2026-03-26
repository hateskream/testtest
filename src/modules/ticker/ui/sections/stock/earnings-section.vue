<script setup lang="ts">
import { isFeatureEnabled } from '@/shared/lib';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { TickerPriceToEarningsWidget } from '@/modules/widgets/price-to-earnings';
import { EpsTilesTickerWidget } from '@/modules/widgets/eps-tiles';
import { EarningsPerShareTickerWidget } from '@/modules/widgets/earnings-per-share';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const earningsPerShareIsEnabled = isFeatureEnabled('TICKER_WIDGET_EARNINGS_PER_SHARE_ENABLED');
const epsTilesIsEnabled = isFeatureEnabled('TICKER_WIDGET_EPS_TILES_ENABLED');
const priceToEarningsIsEnabled = isFeatureEnabled('TICKER_WIDGET_PRICE_TO_EARNINGS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<earnings-per-share-ticker-widget
			v-if="earningsPerShareIsEnabled"
			:meta="{ tickerId, name: 'Earnings per Share' }"
		/>
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
