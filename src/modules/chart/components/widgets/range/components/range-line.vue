<script setup lang="ts">
interface IRangeData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

const props = defineProps<{
	data: Record<string, IRangeData>;
	modelValue?: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

import { computed } from 'vue';
import { useVModel } from '@vueuse/core';

import PeriodSelect from './period-select.vue';

// Use VueUse's useVModel with a fallback to the first period if not provided
const selectedPeriod = useVModel(
	props,
	'modelValue',
	emit,
	{ defaultValue: () => Object.keys(props.data)[0] },
);

const periods = computed(() => Object.keys(props.data));
const currentData = computed(() => props.data[selectedPeriod.value]);

// Calculate positions as percentages
const getStartPercentage = computed(() => {
	const { min, max, start } = currentData.value;
	return ((start - min) / (max - min)) * 100;
});

const getCurrentPercentage = computed(() => {
	const { min, max, current } = currentData.value;
	return ((current - min) / (max - min)) * 100;
});

// Determine if price is up or down from start
const isPriceUp = computed(() => {
	return currentData.value.current >= currentData.value.start;
});

// Calculate the width and left position of the highlight
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

const formatCurrency = (value: number, symbol: string): string => {
	return `${symbol}${value.toFixed(2)}`;
};
</script>

<template>
	<div class="range-wrapper">
		<div class="range-header">
			<div class="range-label">Low</div>
			<period-select
				v-model="selectedPeriod"
				:periods="periods"
			/>
			<div class="range-label">High</div>
		</div>

		<div class="range-values">
			<div class="min-value">{{ formatCurrency(currentData.min, currentData.symbol) }}</div>
			<div class="max-value">{{ formatCurrency(currentData.max, currentData.symbol) }}</div>
		</div>

		<div class="range-bar-container">
			<!-- Base line -->
			<div class="range-bar-background"></div>

			<!-- Highlighted section between start and current -->
			<div
				class="range-bar-highlight"
				:class="{ 'price-up': isPriceUp, 'price-down': !isPriceUp }"
				:style="highlightStyle"
			></div>

			<!-- Start price indicator -->
			<div
				class="range-marker start-marker"
				:style="{ left: `${getStartPercentage}%` }"
			></div>

			<!-- Current price indicator -->
			<div
				class="range-marker current-marker"
				:style="{ left: `${getCurrentPercentage}%` }"
			></div>
		</div>

		<!-- Start and current price values -->
		<div class="price-indicators">
			<!-- Start price value -->
			<div
				class="price-value start-price"
				:style="{ left: `${getStartPercentage}%` }"
			>
				<div class="price-label">Start</div>
				<div class="price-amount">{{ formatCurrency(currentData.start, currentData.symbol) }}</div>
			</div>

			<!-- Current price value -->
			<div
				class="price-value current-price"
				:style="{ left: `${getCurrentPercentage}%` }"
			>
				<div class="price-label">Current</div>
				<div class="price-amount" :class="{ 'text-up': isPriceUp, 'text-down': !isPriceUp }">
					{{ formatCurrency(currentData.current, currentData.symbol) }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.range-wrapper {
	background-color: #1a1a1a;
	color: white;
	padding: 16px;
	border-radius: 8px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.range-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.range-label {
	font-size: 14px;
	color: #aaa;
}

.range-values {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12px;
}

.min-value, .max-value {
	font-size: 16px;
	font-weight: bold;
}

.range-bar-container {
	position: relative;
	height: 4px;
	margin: 20px 0 10px;
}

.range-bar-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	background-color: #333;
	border-radius: 2px;
}

.range-bar-highlight {
	position: absolute;
	top: 0;
	height: 4px;
	border-radius: 2px;
}

.price-up {
	background-color: #00e676; /* Green for price increase */
}

.price-down {
	background-color: #ff5252; /* Red for price decrease */
}

.range-marker {
	position: absolute;
	width: 2px;
	height: 12px;
	top: -4px;
	transform: translateX(-1px);
}

.start-marker {
	background-color: rgba(255, 255, 255, 0.5);
}

.current-marker {
	background-color: white;
}

/* Price value indicators */
.price-indicators {
	position: relative;
	height: 40px;
	margin-top: 5px;
}

.price-value {
	position: absolute;
	transform: translateX(-50%);
	text-align: center;
	min-width: 80px;
}

.price-label {
	font-size: 12px;
	color: #aaa;
	margin-bottom: 2px;
}

.price-amount {
	font-size: 14px;
	font-weight: bold;
}

.start-price .price-amount {
	color: #ddd;
}

.text-up {
	color: #00e676; /* Green for price increase */
}

.text-down {
	color: #ff5252; /* Red for price decrease */
}
</style>
