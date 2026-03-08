<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { AddressesByHoldingsTickerWidget } from '@/modules/widgets/addresses-by-holdings';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const addressesByHoldingsIsEnabled = isFeatureEnabled('TICKER_WIDGET_ADDRESSES_BY_HOLDINGS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<div v-if="addressesByHoldingsIsEnabled" :class="classes.widgets">
			<addresses-by-holdings-ticker-widget
				:meta="{ tickerId, name: 'Addresses by Holdings' }"
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
	height: 250px;
}

.widgetItem {
	flex: 1 0 0;
	max-width: 50%;
	height: 100%;
}
</style>
