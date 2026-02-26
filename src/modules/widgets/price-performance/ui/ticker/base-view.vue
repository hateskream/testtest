<script setup lang="ts">
import { type Component, computed } from 'vue';

import {
	BasePricePerformance, CryptoPricePerformance,
	EtfPricePerformance, ForexPricePerformance, IndicesPricePerformance, StockPricePerformance,
	CommoditiesPricePerformance,
} from './price-performance';
import { MarketType } from '@/modules/market';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { type PricePerformance } from '../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

interface IProps {
	data: PricePerformance;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();


const marketToWidgetMap: Record<MarketType, Component> = {
	[MarketType.Crypto]: CryptoPricePerformance,
	[MarketType.Stock]: StockPricePerformance,
	[MarketType.Forex]: ForexPricePerformance,
	[MarketType.Indices]: IndicesPricePerformance,
	[MarketType.Etf]: EtfPricePerformance,
	[MarketType.Commodities]: CommoditiesPricePerformance,
} as const;

const marketType = computed(() => resolveMarketTypeFromTicker(props.meta.tickerId));
const marketPricePerformanceComponent = computed(() => {
	const type = marketType.value;
	if (!type) {
		return BasePricePerformance;
	}
	return marketToWidgetMap[type];
});


</script>
<template>
	<market-price-performance-component :data="props.data" :meta="props.meta" />
</template>
