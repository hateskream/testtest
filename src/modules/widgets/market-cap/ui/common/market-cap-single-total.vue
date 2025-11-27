<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IDisplaySettings } from '../../model';
import { prettyNumberWithKey } from '@/shared/lib';

import MarketCapTotalSegment from './market-cap-total-segment.vue';

interface IMarketCapSingleSummaryProps {
	displaySettings: IDisplaySettings;
	marketCap: number;
	volume: number;
	changePercent: number;
}

const props = defineProps<IMarketCapSingleSummaryProps>();

function formatValue(value: number) {
	const prepared = prettyNumberWithKey(value.toString(), 2);

	return `${prepared.value}${prepared.suffix}`;
}

const preparedMarketCap = computed(() => formatValue(props.marketCap));
const preparedVolume = computed(() => formatValue(props.volume));

const preparedChangePercent = computed(() => Math.abs(props.changePercent).toFixed(2));
</script>

<template>
	<div :class="classes.root">
		<market-cap-total-segment name="Market cap">
			<div :class="classes.title">$ {{ preparedMarketCap }}</div>
			<div
				v-if="props.displaySettings.isShowChange"
				:class="[classes.change, props.changePercent > 0 ? classes.positive : classes.negative]"
			>
				<ui-icon
					:id="props.changePercent > 0 ? IconIds.Gainers : IconIds.Loosers"
					height="6px"
					width="6px"
				/>
				<div>
					{{ preparedChangePercent }}%
				</div>
			</div>
		</market-cap-total-segment>
		<market-cap-total-segment name="Volume">
			<div :class="classes.title">$ {{ preparedVolume }}</div>
		</market-cap-total-segment>
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
	font-weight: 440;
	font-size: var(--font-title-200-size, 16.8px);
	line-height: 160%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.134px;
}

.change {
	display: flex;
	align-items: center;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	letter-spacing: 0.122px;
	gap: 2px;
}

.positive {
	color: var(--metrics-color-positive-chart);
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}
</style>
