<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IDisplaySettings, IMarketCapSummary } from '../../model';
import type { IMeta } from '@/modules/dashboard-group';
import { prettyNumberWithKey } from '@/shared/lib';

import MarketCapSummarySegment from './market-cap-summary-segment.vue';

interface IMarketCapSummaryProps {
	meta: IMeta;
	displaySettings: IDisplaySettings;
	summary: IMarketCapSummary;
}

const props = defineProps<IMarketCapSummaryProps>();

function formatValue(value: string) {
	const prepared = prettyNumberWithKey(value, 2);

	return `${prepared.value}${prepared.suffix}`;
}

const preparedMarketCap = computed(() => formatValue(props.summary.marketCap));
const preparedVolume = computed(() => formatValue(props.summary.volume));
</script>

<template>
	<div :class="classes.root">
		<market-cap-summary-segment name="Market cap">
			<div :class="classes.title">$ {{ preparedMarketCap }}</div>
			<div
				v-if="props.displaySettings.isShowChange"
				:class="[classes.change, props.summary.change24h > 0 ? classes.positive : classes.negative]"
			>
				<ui-icon
					:id="props.summary.change24h > 0 ? IconIds.Gainers : IconIds.Loosers"
					height="12px"
					width="12px"
				/>
				<div>
					{{ props.summary.change24h.toFixed(2) }}%
				</div>
			</div>
		</market-cap-summary-segment>
		<market-cap-summary-segment name="Volume">
			<div :class="classes.title">$ {{ preparedVolume }}</div>
		</market-cap-summary-segment>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	gap: 12px;
	overflow-x: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.title {
	font-size: 16.8px;
	line-height: 160%;
}

.change {
	display: flex;
	align-items: center;
	font-weight: 400;
	gap: 4px;
	font-size: 12.5px;
	line-height: 180%;
	letter-spacing: 0.075px;
}

.positive {
	color: var(--metrics-color-positive-chart);
}

.negative {
	color: var(--metrics-color-negative-chart);
}
</style>
