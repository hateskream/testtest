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

const numericValue = computed<number | null>(() => {
	const raw = props.data.value;

	if (raw === undefined || raw === null || raw === 'N/A') {
		return null;
	}

	const cleaned = String(raw)
		.replace(/%/g, '')
		.replace(/^--?/, '-');

	const num = Number(cleaned);

	return Number.isFinite(num) ? num : null;
});

const isDownTrend = computed(() => {
	if (props.data.trend) {
		return props.data.trend === Trend.DOWN;
	}

	return (numericValue.value ?? 0) < 0;
});

const isUpTrend = computed(() => {
	if (props.data.trend) {
		return props.data.trend === Trend.UP;
	}

	return (numericValue.value ?? 0) > 0;
});

const displayValue = computed(() => {
	const { value } = numericValue;

	if (value === null) {
		return '—';
	}

	if (value === 0) {
		return '0%';
	}

	const abs = Math.abs(value);

	return value < 0 ? `—${abs}%` : `${abs}%`;
});

const barWidth = computed(() => {
	const { value } = numericValue;
	const max = props.data.maxAbsValue;

	if (value === null || !max || max <= 0) {
		return 0;
	}

	return Math.min((Math.abs(value) / max) * 100, 100);
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
