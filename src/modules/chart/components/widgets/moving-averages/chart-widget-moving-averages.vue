<script setup lang="ts">
import { computed, ref } from 'vue';

import { ChartCommonWidgetLayout } from '../../shared/ui';
import type { IMovingAveragesSignal } from './models/moving-averages';
import { getDefaultMovingAveragesViewState } from './models/moving-averages';

import MovingAveragesChart from './moving-averages-chart.vue';

const signal = ref<IMovingAveragesSignal>({
	signal: 22,
	summary: 'Sell',
});

const randomSignal = () => {
	const newSignal = Math.floor(Math.random() * 100) + 1;
	signal.value.signal = newSignal;

	if (newSignal <= 20) {
		signal.value.summary = 'Strong Sell';
	} else if (newSignal <= 40) {
		signal.value.summary = 'Sell';
	} else if (newSignal <= 60) {
		signal.value.summary = 'Neutral';
	} else if (newSignal <= 80) {
		signal.value.summary = 'Buy';
	} else {
		signal.value.summary = 'Strong Buy';
	}
};

const colorByStatus = computed(() => {
	const { summary } = signal.value;
	return summary === 'Strong Sell' || summary === 'Sell' ?
		'var(--text-color-negative-500)' :
		summary === 'Strong Buy' || summary === 'Buy' ?
			'var(--text-color-positive-500)' :
			'var(--text-color-base-500)';
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.header">
				Moving Averages
				<div
					:class="classes.summary"
					:style="{color: colorByStatus}"
				>
					{{ signal.summary }}
				</div>
			</div>
		</template>
		<template #body>
			<moving-averages-chart
				:signal="signal"
				:size="{h:3, w:3}"
				:view-state="getDefaultMovingAveragesViewState()"
				@update-interactive="randomSignal"
			/>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.header {
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
}

.summary {
	display: flex;
	align-items: center;
	padding: 1px 5px;
	font-size: 12px;
	line-height: normal;
	color: #999999;
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;
}
</style>
