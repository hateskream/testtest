<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IDisplaySettings } from '../../model';
import { prettyNumberWithKey } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

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
			<ui-text
				:class="classes.title"
				as="div"
				token="title-200"
			>
				<span>$</span>
				<span>{{ preparedMarketCap }}</span>
			</ui-text>
			<div
				v-if="props.displaySettings.isShowChange"
				:class="[classes.change, props.changePercent > 0 ? classes.positive : classes.negative]"
			>
				<ui-icon
					:id="props.changePercent > 0 ? IconIds.Gainers : IconIds.Loosers"
					height="6px"
					width="6px"
				/>
				<ui-text token="text-200-r">
					{{ preparedChangePercent }}%
				</ui-text>
			</div>
		</market-cap-total-segment>
		<market-cap-total-segment name="Volume">
			<ui-text
				:class="classes.title"
				as="div"
				token="title-200"
			>
				<span>$</span>
				<span>{{ preparedVolume }}</span>
			</ui-text>
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
	display: inline-flex;
	color: var(--text-500, rgb(255 255 255 / 96%));
	gap: 2px;
}

.change {
	display: flex;
	align-items: center;
	gap: 2px;
}

.positive {
	color: var(--metrics-color-positive-chart);
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}
</style>
