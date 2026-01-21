<script setup lang="ts">
import { computed } from 'vue';

import { type TickerMarket as TickerMarketType, TickerMarket } from '@/modules/ticker';
import type { ActivityMetrics } from '../../model';
import { CommodityMetrics, CryptoMetrics, EtfMetrics, ForexMetrics, IndexMetrics, StockMetrics } from './metrics';

interface IActivityMetricsProps {
	market: TickerMarketType;
	metrics: ActivityMetrics;
}

const props = defineProps<IActivityMetricsProps>();

const marketToWidgetMap = {
	[TickerMarket.CRYPTO]: CryptoMetrics,
	[TickerMarket.STOCK]: StockMetrics,
	[TickerMarket.FOREX]: ForexMetrics,
	[TickerMarket.INDEX]: IndexMetrics,
	[TickerMarket.ETF]: EtfMetrics,
	[TickerMarket.COMMODITY]: CommodityMetrics,
} as const;

const marketMetricsComponent = computed(() => marketToWidgetMap[props.market] ?? CryptoMetrics);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metricsByMarket = computed(() => props.metrics as unknown as any);
</script>
<template>
	<component :is="marketMetricsComponent" :metrics="metricsByMarket" />
</template>
