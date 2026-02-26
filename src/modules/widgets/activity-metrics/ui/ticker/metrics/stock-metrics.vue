<script setup lang="ts">
import { TickerControlLink } from '@/modules/ticker/ui/base';
import { RouteNames } from '@/types/route.d';
import type { StockActivityMetrics } from '../../../model';
import { MetricsContainer, MetricsRow } from '../../common';
import { isFeatureEnabled } from '@/shared/lib';
import { UiTag } from '@/shared/ui/tag';

import BaseMetrics from './base-metrics.vue';

export interface IStockMetricsProps {
	metrics: StockActivityMetrics;
}

const props = defineProps<IStockMetricsProps>();

const sectorLinkIsEnabled = isFeatureEnabled('STOCK_TICKER_SECTOR_LINK_ENABLED');
</script>

<template>
	<base-metrics>
		<metrics-container
			title="Market Cap"
			tooltip="The total value of a company’s outstanding shares of stock. It is calculated
			by multiplying the current share price by the number of shares outstanding.
			It indicates company size and scale in the market."
			:class="classes.full"
		>
			<template #default>
				{{ props.metrics.marketCap }}
			</template>
			<template #tooltip>
				<div>
					<p>Current share price × shares outstanding.</p>
					<p>Shows the company’s total equity value and relative size.</p>
				</div>
			</template>
		</metrics-container>
		<metrics-container
			title="Volume"
			tooltip="Total shares traded today. Reflects intraday activity and liquidity."
		>
			{{ props.metrics.volume24h }}
		</metrics-container>
		<metrics-container
			title="Total Return (3M)"
			tooltip="Percentage gain or loss over the past three months,
			including price changes and reinvested dividends."
		>
			{{ props.metrics.totalReturn3m }}
		</metrics-container>
		<metrics-container
			title="Total Return (1Y)"
			tooltip="Percentage gain or loss over the past year, including price changes and reinvested dividends."
		>
			{{ props.metrics.totalReturn1y }}
		</metrics-container>
		<metrics-container
			title="Forward P/E"
			tooltip="Price divided by expected earnings over the next 12 months.
			Shows how much investors are paying today for each dollar of future profit."
		>
			{{ props.metrics.forwardPe }}
		</metrics-container>
		<metrics-row title="Sector" :class="classes.full">
			<ticker-control-link v-if="sectorLinkIsEnabled" :to="{ name: RouteNames.Home }">
				{{ props.metrics.sector }}
			</ticker-control-link>
			<ui-tag v-else>
				{{ props.metrics.sector }}
			</ui-tag>
		</metrics-row>
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
