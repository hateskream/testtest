<script setup lang="ts">
import { computed } from 'vue';

import type { ILineChartModel } from './line-chart.model';

const props = withDefaults(defineProps<ILineChartModel>(), {
	value: 0,
	barColor: '#2A2A2A',
	pale: false,
});

const isNegative = computed(() => props.value < 0);
const isPositive = computed(() => props.value > 0);
const isZero = computed(() => props.value === 0);

const fillPercentage = computed(() => {
	return Math.min(Math.abs(props.value), 100);
});

const filledColor = computed(() => {
	if (props.pale) {
		return 'rgb(80, 80, 81)';
	}

	if (isNegative.value) {
		return 'var(--text-color-negative-500)';
	} else if (isPositive.value) {
		return 'var(--text-color-positive-500)';
	}
	// fallback
	return props.barColor || '#FFF';
});

const borderColor = computed(() => {
	if (props.pale) {
		return '#8A8A8A';
	}

	if (isNegative.value) {
		return 'var(--text-color-negative-500)';
	} else if (isPositive.value) {
		return 'var(--text-color-positive-500)';
	}
	return props.barColor || '#FFF';
});
</script>

<template>
	<div :class="classes.barChart">
		<div :class="classes.barChartWrapper">
			<!-- Центральный разделитель -->
			<div :class="classes.centerDivider" />

			<!-- Заполненная зона -->
			<div
				v-if="!isZero"
				:class="[
					classes.filledZone,
					{ [classes.filledZoneNegative]: isNegative },
					{ [classes.filledZonePositive]: isPositive }
				]"
			>
				<div :class="classes.fill" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.barChart {
	display: flex;
	flex-grow: 1;
	align-self: stretch;
	height: 16px;
}

.barChartWrapper {
	position: relative;
	width: 100%;
	height: 100%;
	background: var(--color-bg-surface-02, #161618);
	border-radius: 4px;
}

.centerDivider {
	position: absolute;
	top: -2px;
	bottom: -2px;
	left: 50%;
	z-index: 2;
	flex-shrink: 0;
	width: 2px;
	background: var(--color-bg-contrast-500, #ebebeb);
	border-radius: 2px;
	transform: translateX(-50%);
}

.filledZone {
	position: absolute;
	top: 0;
	height: 100%;
	transition: width 0.3s ease;
}

.filledZonePositive {
	left: 50%;
	width: calc(v-bind(fillPercentage) * 0.5%);
	border-right: 1px solid v-bind(borderColor);
}

.filledZoneNegative {
	right: 50%;
	width: calc(v-bind(fillPercentage) * 0.5%);
	border-left: 1px solid v-bind(borderColor);
}

.fill {
	width: 100%;
	height: 100%;
	background: v-bind(filledColor);
	filter: opacity(0.5) brightness(0.6);
	transition: width 0.3s ease;
}
</style>
