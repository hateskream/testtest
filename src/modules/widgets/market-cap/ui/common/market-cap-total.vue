<script setup lang="ts">
import { computed } from 'vue';

import type { IDisplaySettings, IMarketCapMarket, IMarketCapTicker, IMarketCapTotal } from '../../model';
import type { IMeta } from '@/modules/dashboard-group';

import MarketCapMultipleTotal from './market-cap-multiple-total.vue';
import MarketCapSingleTotal from './market-cap-single-total.vue';

interface IMarketCapTotalProps {
	meta: IMeta;
	displaySettings: IDisplaySettings;
	total: IMarketCapTotal;
	tickers: IMarketCapTicker[];
	markets: IMarketCapMarket[];
}

const props = defineProps<IMarketCapTotalProps>();

const totalCount = computed(() => props.tickers.length + props.markets.length);

const preparedSingleTotal = computed(() => {
	if (totalCount.value > 1) {
		return null;
	}

	const target = props.tickers.length > 0 ? props.tickers[0] : props.markets[0];

	return {
		marketCap: props.total.marketCap[target.id],
		volume: props.total.volume[target.id],
		changePercent: props.total.changePercent[target.id],
	} ;
});
</script>

<template>
	<market-cap-multiple-total
		v-if="totalCount > 1"
		:tickers="props.tickers"
		:markets="props.markets"
		:total="props.total"
	/>
	<market-cap-single-total
		v-else-if="preparedSingleTotal"
		:display-settings="props.displaySettings"
		:market-cap="preparedSingleTotal.marketCap"
		:volume="preparedSingleTotal.volume"
		:change-percent="preparedSingleTotal.changePercent"
	/>
</template>

<style module="classes"></style>
