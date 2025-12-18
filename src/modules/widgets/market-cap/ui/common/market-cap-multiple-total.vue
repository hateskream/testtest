<script setup lang="ts">
import { computed } from 'vue';

import type { IMarketCapMarket, IMarketCapTicker, IMarketCapTotal } from '../../model';
import { prettyNumberWithKey } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

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

function formatChangePercent(value: number) {
	if (value < 0) {
		// by design
		// eslint-disable-next-line no-irregular-whitespace
		return `- ${Math.abs(value).toFixed(2)}`;
	}

	return value.toFixed(2);
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
			formattedChangePercent: formatChangePercent(props.total.changePercent[ticker.id]),
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
			formattedChangePercent: formatChangePercent(props.total.changePercent[market.id]),
		};
	});
});

const preparedTotals = computed(() => {
	return [...preparedMarketsTotal.value, ...preparedTickersTotal.value];
});
</script>

<template>
	<div :class="classes.list">
		<ui-text
			v-for="entity in preparedTotals"
			:key="entity.id"
			:class="classes.ticker"
			as="div"
			token="text-200-r"
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
					{{ entity.formattedChangePercent }}%
				</div>
			</div>
		</ui-text>
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
	border-radius: var(--radius-full, 9999px);
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
