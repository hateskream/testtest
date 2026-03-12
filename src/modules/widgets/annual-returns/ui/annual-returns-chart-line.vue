<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { AnnualReturnsItem } from '../model';

interface IAnnualReturnsLineProps {
	item: AnnualReturnsItem;
}

const props = defineProps<IAnnualReturnsLineProps>();

const fillPercentage = computed(() => {
	return Math.min(Math.abs(props.item.value), 100);
});

const filledColor = computed(() => {
	if (props.item.status === 'negative') {
		return 'rgba(252, 74, 107, 0.12)';
	}
	if (props.item.status === 'positive') {
		return 'rgba(4, 237, 160, 0.1)';
	}

	return 'rgba(255, 255, 255, 0.1)';
});

const borderColor = computed(() => {
	if (props.item.status === 'negative') {
		return '#FC1D4D';
	}
	if (props.item.status === 'positive') {
		return '#04EDA0';
	}

	return 'rgba(255, 255, 255, 0.62)';
});

const classes = useCssModule('classes');

const fillZoneClass = computed(() => {
	if (props.item.value < 0) {
		return classes.filledZoneNegative;
	}

	if (props.item.value > 0) {
		return classes.filledZonePositive;
	}

	return null;
});
</script>

<template>
	<div :class="classes.barChart">
		<div :class="classes.barChartWrapper">
			<div :class="classes.centerDivider" />

			<div
				:class="[
					classes.filledZone,
					fillZoneClass
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
	background: var(--atom-base-90, rgb(73 73 80 / 15%));
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
