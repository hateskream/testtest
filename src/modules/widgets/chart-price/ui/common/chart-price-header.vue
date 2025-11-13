<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IChartPriceHeaderProps {
	showTime?: boolean;
	price: number;
	change: {
		value: number;
		percent: number;
	};
	closeTime: Date;
}

const props = defineProps<IChartPriceHeaderProps>();

const preparedTime = computed(() =>
	props.closeTime.toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}),
);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.segment">
			<p v-if="props.showTime" :class="classes.segmentTime">
				At Close: {{ preparedTime }}
			</p>
			<div :class="classes.segmentRow">
				<div :class="classes.segmentValue">
					<span>$</span>
					<span>{{ props.price.toFixed(2) }}</span>
				</div>
				<div
					:class="[
						classes.segmentChange,
						props.change.value > 0 ? classes.positive : classes.negative,
					]"
				>
					<ui-icon
						:id="props.change.value > 0 ? IconIds.Gainers : IconIds.Loosers"
						height="12px"
						width="12px"
						:class="classes.segmentChangeIcon"
					/>
					<div :class="classes.segmentChangeValue">
						{{ props.change.value.toFixed(2) }} ({{
							props.change.percent.toFixed(2)
						}}%)
					</div>
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
	font-weight: 440;
	font-size: 21px;
	line-height: 150%;
	color: var(--text-color-base-500);
	letter-spacing: 0.168px;
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

.segmentChangeValue {
	font-weight: 400;
	font-size: 13.3px;
	line-height: 180%;
	letter-spacing: 0.146px;
}
</style>
