<script setup lang="ts">
import { computed } from 'vue';
import { useVModel } from '@vueuse/core';

import { PeriodSelect } from './components';
interface IRangeData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

export interface IRangeLineProps {
	data: Record<string, IRangeData>;
	modelValue?: string;
}

const props = defineProps<IRangeLineProps>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const selectedPeriod = useVModel(
	props,
	'modelValue',
	emit,
);

const periods = computed(() => Object.keys(props.data));
const currentData = computed(() => {
	if (!selectedPeriod.value) {
		return {
			min: 0,
			max: 0,
			start: 0,
			current: 0,
			symbol : '$',
		};
	}
	return props.data[selectedPeriod.value];

});

const getStartPercentage = computed(() => {
	const { min, max, start } = currentData.value;
	return ((start - min) / (max - min)) * 100;
});

const getCurrentPercentage = computed(() => {
	const { min, max, current } = currentData.value;
	return ((current - min) / (max - min)) * 100;
});

const isPriceUp = computed(() => {
	return currentData.value.current >= currentData.value.start;
});

const highlightStyle = computed(() => {
	const startPct = getStartPercentage.value;
	const currentPct = getCurrentPercentage.value;

	if (isPriceUp.value) {
		return {
			left: `${startPct}%`,
			width: `${currentPct - startPct}%`,
		};
	} else {
		return {
			left: `${currentPct}%`,
			width: `${startPct - currentPct}%`,
		};
	}
});

function formatCurrency(value: number, symbol: string): string {
	return `${symbol}${value.toFixed(2)}`;
};
</script>

<template>
	<div :class="classes.rangeWrapper">
		<div :class="classes.rangeHeader">
			<div :class="classes.rangeLabel">Low</div>
			<period-select
				v-model="selectedPeriod"
				:periods="periods"
			/>
			<div :class="classes.rangeLabel">High</div>
		</div>

		<div :class="classes.rangeValues">
			<div :class="classes.minValue">{{ formatCurrency(currentData.min, currentData.symbol) }}</div>
			<div :class="classes.maxValue">{{ formatCurrency(currentData.max, currentData.symbol) }}</div>
		</div>

		<div :class="classes.rangeBarContainer">
			<div :class="classes.rangeBarBackground"></div>

			<div
				:class="[
					classes.rangeBarHighlight,
					isPriceUp ? classes.priceUp : classes.priceDown
				]"
				:style="highlightStyle"
			></div>

			<div
				:class="[classes.rangeMarker]"
				:style="{ left: `${getStartPercentage}%` }"
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
	font-size: 14px;
	color: #aaaaaa;
}

.rangeValues {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12px;
}

.minValue,
.maxValue {
	font-weight: bold;
	font-size: 16px;
}

.rangeBarContainer {
	position: relative;
	height: 4px;
	margin: 20px 0 10px;
}

.rangeBarBackground {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	height: 4px;
	background-color: #333333;
	border-radius: 2px;
}

.rangeBarHighlight {
	position: absolute;
	top: 0;
	height: 4px;
	border-radius: 2px;
}

.priceUp {
	background-color: #00e676;
}

.priceDown {
	background-color: #ff5252;
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
