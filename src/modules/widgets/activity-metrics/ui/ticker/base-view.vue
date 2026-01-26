<script setup lang="ts">
import { type Component, computed } from 'vue';

import type { ActivityMetrics } from '../../model';
import { CommodityMetrics, CryptoMetrics, EtfMetrics, ForexMetrics, IndexMetrics, StockMetrics } from './metrics';
import { MarketType } from '@/modules/market';

const props = defineProps<{
	metrics: ActivityMetrics;
}>();

const marketToWidgetMap: Record<MarketType, Component> = {
	[MarketType.Crypto]: CryptoMetrics,
	[MarketType.Stock]: StockMetrics,
	[MarketType.Forex]: ForexMetrics,
	[MarketType.Indices]: IndexMetrics,
	[MarketType.Etf]: EtfMetrics,
	[MarketType.Commodities]: CommodityMetrics,
} as const;

const marketMetricsComponent = computed(() => marketToWidgetMap[props.metrics.marketType]);
</script>
<template>
	<market-metrics-component :metrics="props.metrics" />
</template>
