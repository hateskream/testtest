<script setup lang="ts">
import { computed } from 'vue';

import type { IMarketCapMarket, IMarketCapTicker, IMarketCapTotal } from '../../model';
import { prettyNumberWithKey } from '@/shared/lib';

interface IMarketCapTickersSummaryProps {
	tickers: IMarketCapTicker[];
	markets: IMarketCapMarket[];
	total: IMarketCapTotal;
}

const props = defineProps<IMarketCapTickersSummaryProps>();

function formatMarketCap(value: number) {
	const prepared = prettyNumberWithKey(value.toString(), 2);
	return `${prepared.value} ${prepared.suffix}`;
}

const preparedTickersTotal = computed(() => {
	return props.tickers.map(ticker => {
		return {
			id: ticker.id,
			label: ticker.symbol,
			color: ticker.color,
			marketCap: formatMarketCap(props.total.marketCap[ticker.id]),
			volume: props.total.volume[ticker.id],
			changePercent: props.total.changePercent[ticker.id],
		};
	});
});

const preparedMarketsTotal = computed(() => {
	return props.markets.map(market => {
		return {
			id: market.id,
			label: market.id,
			color: market.color,
			marketCap: formatMarketCap(props.total.marketCap[market.id]),
			volume: props.total.volume[market.id],
			changePercent: props.total.changePercent[market.id],
		};
	});
});

const preparedTotals = computed(() => {
	return [...preparedMarketsTotal.value, ...preparedTickersTotal.value];
});
</script>

<template>
	<div :class="classes.list">
		<div
			v-for="entity in preparedTotals"
			:key="entity.id"
			:class="classes.ticker"
		>
			<div :class="[classes.segment, classes.name]">
				<div :class="classes.circle" :style="{ backgroundColor: entity.color }"></div>
				<span>
					{{ entity.label }}
				</span>
			</div>
			<div :class="classes.segment">
				<div :class="classes.value">
					${{ entity.marketCap }}
				</div>
				<div
					:class="[entity.changePercent > 0 ? classes.positive : classes.negative]"
				>
					{{ entity.changePercent }}%
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.list {
	flex: 0 0 auto;
	max-height: 100px;
	overflow-y: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.ticker {
	display: flex;
	align-items: center;
	width: max-content;
	height: 17px;
	margin-bottom: 4px;
	overflow: hidden;
	font-weight: 440;
	font-size: 10px;
	line-height: 170%;
	letter-spacing: 0.08px;
	border-radius: 16px;
	gap: 1px;
}

.segment {
	display: flex;
	align-items: center;
	padding: 0 6px;
	background-color: var(--bg-color-surface-03);
	gap: 6px;
}

.name {
	color: var(--text-color-base-300);
}

.circle {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.value {
	color: var(--text-color-base-500);
}

.positive {
	color: var(--metrics-color-positive-chart);
}

.negative {
	color: var(--metrics-color-negative-chart);
}
</style>
