<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { prettyNumberWithKey } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import { formatPrice } from '@/modules/charts/common/lib';

interface IChartPriceHeaderProps {
	showTime?: boolean;
	price: number;
	changePercent: number;
	changeDelta: number;
	closeTime: Date;
}

const props = defineProps<IChartPriceHeaderProps>();

const preparedTime = computed(() => {
	return props.closeTime.toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
});

const isUpTrend = computed(() => props.changePercent > 0);

const formattedPrice = computed(() => formatPrice(props.price));

const formattedChangeDelta = computed(() => {
	const { row } = prettyNumberWithKey(Math.abs(props.changeDelta), 2);
	return row;
});

const formattedChangePercent = computed(() => {
	return Math.abs(props.changePercent).toFixed(2);
});
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.segment">
			<p v-if="props.showTime" :class="classes.segmentTime">
				At Close: {{ preparedTime }}
			</p>
			<div :class="classes.segmentRow">
				<ui-text token="title-300" :class="classes.segmentValue">
					<span>$</span>
					<span>{{ formattedPrice }}</span>
				</ui-text>
				<div
					:class="[
						classes.segmentChange,
						isUpTrend ? classes.positive : classes.negative,
					]"
				>
					<ui-icon
						:id="isUpTrend ? IconIds.Gainers : IconIds.Loosers"
						height="8px"
						width="8px"
						:class="classes.segmentChangeIcon"
					/>
					<ui-text token="text-300-r">
						<span>{{formattedChangeDelta}}</span>
						<span> (</span>
						<span v-if="props.changePercent < 0">−&nbsp;</span>
						<span>{{formattedChangePercent}}</span>
						<span>%)</span>
					</ui-text>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	padding: 6px 0 12px;
}

.segment {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.segmentRow {
	display: flex;
	align-items: center;
	gap: 6px;
}

.segmentTime {
	font-weight: 440;
	font-size: 10px;
	line-height: 170%;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.segmentValue {
	display: flex;
	color: var(--text-color-base-500);
	gap: 2px;
}

.segmentChange {
	display: flex;
	align-items: center;
	gap: 4px;

	&.positive {
		color: var(--metrics-color-positive-chart);
	}

	&.negative {
		color: var(--metrics-color-negative-chart);
	}
}

.segmentChangeIcon {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
