<script setup lang="ts">
import { ConsumerPriceIndexTickerWidget } from '@/modules/widgets/consumer-price-index';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';

import EmptyTickerWidget from '../empty-ticker-widget.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<div :class="classes.row">
			<empty-ticker-widget
				:class="classes.federalFunds"
				style="height: 175px;"
				:meta="{ tickerId, name: 'Federal funds' }"
			/>
			<empty-ticker-widget
				:class="classes.inflation"
				style="height: 175px;"
				:meta="{ tickerId, name: 'US inflation (1Y)' }"
			/>
		</div>
		<consumer-price-index-ticker-widget :class="classes.cpi" :meta="{ tickerId, name: 'Consumer price index' }" />
		<empty-ticker-widget style="height: 370px;" :meta="{ tickerId, name: 'Nominal GDP' }" />
		<div :class="classes.charts">
			<empty-ticker-widget
				:class="classes.chart"
				style="height: 200px;"
				:meta="{ tickerId, name: 'Unemployment Rate (1Y)' }"
			/>
			<empty-ticker-widget
				:class="classes.chart"
				style="height: 200px;"
				:meta="{ tickerId, name: 'Nonfarm Payrolls (1Y)' }"
			/>
		</div>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}

.row {
	display: inline-grid;
	align-self: stretch;
	column-gap: 6px;
	row-gap: 6px;
	grid-template-rows: repeat(1, fit-content(100%));
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.federalFunds {
	grid-row: 1 / span 1;
	grid-column: 1 / span 1;
}

.inflation {
	grid-row: 1 / span 1;
	grid-column: 2 / span 2;
}

.cpi {
	height: 370px;
}

.charts {
	display: flex;
	align-items: center;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}

.chart {
	flex: 1 0 0;
}
</style>
