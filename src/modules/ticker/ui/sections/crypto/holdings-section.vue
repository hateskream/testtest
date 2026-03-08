<script setup lang="ts">
import { AddressesByHoldingsTickerWidget } from '@/modules/widgets/addresses-by-holdings';
import { WhaleHoldingsTickerWidget } from '@/modules/widgets/whale-holdings';
import { isFeatureEnabled } from '@/shared/lib';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const addressesByHoldingsIsEnabled = isFeatureEnabled('TICKER_WIDGET_ADDRESSES_BY_HOLDINGS_ENABLED');
const whaleHoldingsIsEnabled = isFeatureEnabled('TICKER_WIDGET_ADDRESSES_BY_HOLDINGS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<div v-if="addressesByHoldingsIsEnabled || whaleHoldingsIsEnabled" :class="classes.widgets">
			<addresses-by-holdings-ticker-widget
				v-if="addressesByHoldingsIsEnabled"
				:meta="{ tickerId, name: 'Addresses by Holdings' }"
				:class="classes.widgetItem"
			/>
			<whale-holdings-ticker-widget
				v-if="whaleHoldingsIsEnabled"
				:meta="{ tickerId, name: 'Whale Holdings' }"
				:class="classes.widgetItem"
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

.widgets {
	display: flex;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: 6px;
}

.widgetItem {
	height: 250px;
}

@container root (width >= 460px) {
	.widgetItem {
		flex: 1 0 0;
		width: 50%;
	}
}

@container root (width < 460px) {
	.widgets {
		flex-direction: column;
	}
}
</style>
