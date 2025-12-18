<script setup lang="ts">
import { computed } from 'vue';

import { Trend } from '@/modules/cell';
import { UiText } from '@/shared/ui/text';

export interface IPercentData {
	value?: string;
	trend?: Trend;
	maxAbsValue?: number;
}

interface IProps {
	data: IPercentData;
}

const props = defineProps<IProps>();

const isDownTrend = computed(() => {
	if (props.data.trend) {
		return props.data.trend === Trend.DOWN;
	}

	return +(props.data.value ?? 0) < 0;
});

const isUpTrend = computed(() => {
	if (props.data.trend) {
		return props.data.trend === Trend.UP;
	}

	return +(props.data.value ?? 0) > 0;
});

const displayValue = computed(() => {
	if (!props.data.value || props.data.value === 'N/A' || isNaN(+props.data.value)) {
		return '—';
	}

	if (props.data.value === '0') {
		return props.data.value;
	}

	return `${Math.abs(+props.data.value)}%`;
});

const barWidth = computed(() => {
	const { value, maxAbsValue } = props.data;
	if (!value || !maxAbsValue || isNaN(+value)) {
		return 0;
	}

	const absValue = Math.abs(+value);
	return Math.min((absValue / maxAbsValue) * 100, 100);
});
</script>

<template>
	<div
		:class="[classes.rootBarCell, {
			[classes.leftAlign]: props.data.maxAbsValue,
			[classes.negative]: isDownTrend,
			[classes.positive]: isUpTrend
		}]"
		class="percentCell"
	>
		<ui-text
			token="text-300-r"
			:class="[classes.percent, { [classes.percentWithBar]: props.data.maxAbsValue }]"
		>
			<span v-if="isDownTrend">−&nbsp;</span>
			<span>{{ displayValue }}</span>
		</ui-text>
		<div
			v-if="props.data.maxAbsValue"
			:class="classes.bar"
			:style="{ width: `${barWidth}%` }"
		/>
	</div>
</template>

<style module="classes">
.rootBarCell {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	min-height: 24px;
	gap: 12px;
}

.leftAlign {
	justify-content: flex-start;
}

.percentWithBar {
	min-width: 60px;
	text-align: right;
}

.rootBarCell.positive .percent {
	color: var(--success-success-00, #04eda0);
}

.rootBarCell.negative .percent {
	color: var(--warning-warning-00, #fc1d4d);
}

.bar {
	min-width: 8px;
	height: 8px;
	border-radius: 4px;
}

.rootBarCell.positive .bar {
	background-color: var(--success-success-00, #04eda0);
}

.rootBarCell.negative .bar {
	background-color: var(--warning-warning-00, #fc1d4d);
}
</style>
