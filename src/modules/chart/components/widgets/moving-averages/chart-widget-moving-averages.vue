<script setup lang="ts">
import { computed, ref } from 'vue';

import { ChartCommonWidgetLayout } from '../../shared/ui';

import FearGreedDashboard from '@/modules/widgets/fear-greed/ui/view-component.vue';

const tension = ref(22);
const status = ref('negative');
const summary = ref('Sell');
const randomTension = () => {
	tension.value = Math.floor(Math.random() * 100) + 1;
	if (tension.value < 25) {
		status.value = 'negative';
		summary.value = 'Sell';
	} else if (tension.value > 75) {
		status.value = 'positive';
		summary.value = 'Buy';
	} else {
		status.value = 'neutral';
		summary.value = 'Hold';
	}
};

const colorByStatus = computed(() => {
	return status.value === 'negative' ?
		'var(--text-color-negative-500)' :
		status.value === 'positive' ?
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
					{{ summary }}
				</div>
			</div>
		</template>
		<template #body>
			<fear-greed-dashboard
				:tension="{tension:tension}"
				:size="{h:3, w:3}"
				:view-state="{isShowChart: true, isShowDescription: true, isShowPastValues: true, isShowName: true}"
				@update-interactive="randomTension"
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
