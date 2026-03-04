<script setup lang="ts">
import { type Component, computed } from 'vue';

import {
	BaseSectors, CryptoSectors,
	EtfSectors, ForexSectors, IndicesSectors, StockSectors,
	CommoditiesSectors,
} from './sectors';
import { MarketType } from '@/modules/market';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { type Sectors } from '../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

interface IProps {
	data: Sectors;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();


const marketToWidgetMap: Record<MarketType, Component> = {
	[MarketType.Crypto]: CryptoSectors,
	[MarketType.Stock]: StockSectors,
	[MarketType.Forex]: ForexSectors,
	[MarketType.Indices]: IndicesSectors,
	[MarketType.Etf]: EtfSectors,
	[MarketType.Commodities]: CommoditiesSectors,
} as const;

const marketType = computed(() => resolveMarketTypeFromTicker(props.meta.tickerId));
const marketSectorsComponent = computed(() => {
	const type = marketType.value;
	if (!type) {
		return BaseSectors;
	}
	return marketToWidgetMap[type];
});


</script>
<template>
	<market-sectors-component :data="props.data" :meta="props.meta" />
</template>
