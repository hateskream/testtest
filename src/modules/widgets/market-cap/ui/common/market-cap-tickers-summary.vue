<script setup lang="ts">

import { computed } from 'vue';

import type { IMarketCapTicker } from '../../model';
import { prettyNumberWithKey } from '@/shared/lib';

interface IMarketCapTickersSummaryProps {
	tickers: IMarketCapTicker[];
}

const props = defineProps<IMarketCapTickersSummaryProps>();

function formatMarketCap(value: string) {
	const prepared = prettyNumberWithKey(value, 2);

	return `${prepared.value} ${prepared.suffix}`;
}

const formattedMarketCaps = computed(() => props.tickers.map(ticker => formatMarketCap(ticker.marketCap)));
</script>

<template>
	<div :class="classes.list">
		<div
			v-for="(item, key) in props.tickers"
			:key="item.id"
			:class="classes.ticker"
		>
			<div :class="[classes.segment, classes.name]">
				<div :class="classes.circle" :style="{ backgroundColor: item.color }"></div>
				<span>
					{{ item.symbol }}
				</span>
			</div>
			<div :class="classes.segment">
				<div :class="classes.value">
					${{ formattedMarketCaps[key] }}
				</div>
				<div
					:class="[classes.change, item.change24h > 0 ? classes.positive : classes.negative]"
				>
					{{ item.change24h }}%
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
	border-radius: 16px;
	gap: 1px;
}

.segment {
	display: flex;
	align-items: center;
	padding: 6px;
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
