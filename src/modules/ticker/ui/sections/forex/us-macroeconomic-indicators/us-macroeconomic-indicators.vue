<script setup lang="ts">
import { markRaw, ref } from 'vue';

import { ConsumerPriceIndexTickerWidget } from '@/modules/widgets/consumer-price-index';
import { TickerUnemploymentRateWidget } from '@/modules/widgets/unemployment-rate';
import { NonfarmPayrollsTickerWidget } from '@/modules/widgets/nonfarm-payrolls';
import { useTickerContext } from '../../../../composables';
import type { ISectionItem } from '../../../../models';
import { TickerBaseTabsLayout } from '../../../base';

import EmptyTickerWidget from '../../empty-ticker-widget.vue';
import TabNominalGdp from './tab-nominal-gdp.vue';
import TabRealGdp from './tab-real-gdp.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const tabs = [
	{ id: 'nominal', title: 'Nominal GDP', component: markRaw(TabNominalGdp) },
	{ id: 'real', title: 'Real GDP', component: markRaw(TabRealGdp) },
];

const selectedTabId = ref<string | number>('nominal');
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
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs" />
		<div :class="classes.charts">
			<ticker-unemployment-rate-widget
				:class="classes.chart"
				style="height: 200px;"
				:meta="{ tickerId, name: 'Unemployment Rate (1Y)' }"
			/>
			<nonfarm-payrolls-ticker-widget
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
