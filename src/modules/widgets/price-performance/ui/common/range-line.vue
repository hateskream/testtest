
<script setup lang="ts">
import { computed } from 'vue';

import PeriodSelect from './period-select.vue';

interface IRangeItem {
	min: number;
	max: number;
	start: number;
}

export interface IRangeLineProps {
	ranges: Record<string, IRangeItem>;
	currentValue: number;
	symbol: string;
}

const props = defineProps<IRangeLineProps>();

const selectedPeriod = defineModel<string>({ required: true });

const periods = computed(() => Object.keys(props.ranges));

const currentRange = computed((): IRangeItem => {
	if (!selectedPeriod.value || !props.ranges[selectedPeriod.value]) {
		return { min: 0, max: 0, start: 0 };
	}
	return props.ranges[selectedPeriod.value];
});

const startPercentage = computed(() => {
	const { min, max, start }: IRangeItem = currentRange.value;
	if (max === min) {
		return 0;
	}
	return ((start - min) / (max - min)) * 100;
});

const currentPercentage = computed(() => {
	const { min, max }: IRangeItem = currentRange.value;
	if (max === min) {
		return 0;
	}
	return ((props.currentValue - min) / (max - min)) * 100;
});

const isPriceUp = computed(() => {
	return props.currentValue >= currentRange.value.start;
});

const highlightStyle = computed(() => {
	const startPct = startPercentage.value;
	const currentPct = currentPercentage.value;

	const left = Math.min(startPct, currentPct);
	const width = Math.abs(currentPct - startPct);

	return {
		left: `${left}%`,
		width: `${width}%`,
	};
});

function formatCurrency(value: number): string {
	return `${props.symbol}${value.toFixed(2)}`;
}
</script>

<template>
	<div :class="classes.rangeWrapper">
		<div :class="classes.rangeHeader">
			<div>
				<div :class="classes.rangeLabel" class="text-100-r">Low</div>
				<div :class="classes.minValue" class="text-100-r">{{ formatCurrency(currentRange.min) }}</div>
			</div>

			<period-select
				v-model="selectedPeriod"
				:periods="periods"
			/>
			<div>
				<div :class="classes.rangeLabel" class="text-100-r">High</div>
				<div :class="classes.maxValue" class="text-100-r">{{ formatCurrency(currentRange.max) }}</div>
			</div>
		</div>

		<div
			:class="[
				classes.rangeBarContainer,
				isPriceUp ? classes.containerUp : classes.containerDown
			]"
		>
			<div
				:class="[
					classes.rangeBarBackground,
					isPriceUp ? classes.bgUp : classes.bgDown
				]"
			></div>

			<div
				:class="[
					classes.rangeBarHighlight,
					isPriceUp ? classes.priceUp : classes.priceDown
				]"
				:style="highlightStyle"
			></div>

			<div
				:class="classes.rangeMarker"
				:style="{ left: `${startPercentage}%` }"
			></div>
		</div>
	</div>
</template>

<style module="classes">
.rangeWrapper {
	color: var(--text-color-base-500);
}

.rangeHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.rangeLabel {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.minValue,
.maxValue {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.rangeBarContainer {
	position: relative;
	height: 1px;
	margin: 20px 0 10px;
	padding: 0 3px;

	&::before {
		content: '';
		position: absolute;
		top: -8px;
		left: 0;
		width: 1px;
		height: 20px;
		background-color: var(--atom-base-50, rgb(73 73 80 / 52%));
	}

	&::after {
		content: '';
		position: absolute;
		top: -8px;
		right: 0;
		width: 1px;
		height: 20px;
		background-color: var(--atom-base-50, rgb(73 73 80 / 52%));
	}
}


.rangeBarBackground {
	position: absolute;
	top: 0;
	right: 2px;
	left: 2px;
	height: 1px;
	border-radius: 2px;
}

.bgUp {
	background-color: rgb(4 237 160 / 40%);
}

.bgDown {
	background-color: rgb(252 29 77 / 40%);
}

.rangeBarHighlight {
	position: absolute;
	top: -1px;
	height: 4px;
	border-radius: 2px;
}

.priceUp {
	background-color: rgb(4 237 160 / 100%);
}

.priceDown {
	background-color: rgb(252 29 77 / 100%);
}

.rangeMarker {
	position: absolute;
	top: -2px;
	z-index: 2;
	width: 3px;
	height: 14px;
	background-color: #ffffff;
	border: 1px solid #030303;
	border-radius: 999px;
	transform: translateX(-1px);
}
</style>
