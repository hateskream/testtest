<script setup lang="ts">
import { markRaw, ref } from 'vue';

import { ConsumerPriceIndexTickerWidget } from '@/modules/widgets/consumer-price-index';
import { useTickerContext } from '../../../../composables';
import type { ISectionItem } from '../../../../models';
import { UsInflationTickerWidget } from '@/modules/widgets/us-inflation';
import { FederalFundsTickerWidget } from '@/modules/widgets/federal-funds';
import { TickerUnemploymentRateWidget } from '@/modules/widgets/unemployment-rate';
import { NonfarmPayrollsTickerWidget } from '@/modules/widgets/nonfarm-payrolls';
import { TickerBaseTabsLayout } from '../../../base';

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
			<federal-funds-ticker-widget
				:class="classes.federalFunds"
				:meta="{ tickerId, name: 'Federal funds' }"
			/>
			<us-inflation-ticker-widget
				:class="classes.inflation"
				:meta="{tickerId, name:'Us Inflation'}"
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
	container: section / inline-size;
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}

.row {
	display: grid;
	align-items: stretch;
	align-self: stretch;
	column-gap: 6px;
	row-gap: 6px;
	grid-template-columns: 200px minmax(0, 1fr);
}

.federalFunds {
	grid-column: 1;
	min-width: 0;
	min-height: 160px;
}

.inflation {
	grid-column: 2 / -1;
	min-width: 0;
	min-height: 160px;
}

@container section (width < 500px) {
	.row {
		grid-template-columns: 1fr;
	}

	.federalFunds,
	.inflation {
		grid-column: auto;
	}
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
