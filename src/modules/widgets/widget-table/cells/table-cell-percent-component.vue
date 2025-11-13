<script setup lang="ts">
import { computed } from 'vue';

const COLORS = {
	POSITIVE: '#04EDA0',
	NEGATIVE: '#FC4A6B',
} as const;

export interface IPercentData {
	value?: string;
	trend?: string;
	maxAbsValue?: number;
}

interface IProps {
	data: IPercentData;
}

const props = defineProps<IProps>();

const displayValue = computed(() => {
	if (!props.data.value || props.data.value === 'N/A' || isNaN(+props.data.value)) {
		return '—';
	}
	if (props.data.value === '0') {
		return props.data.value;
	}
	return `${props.data.value}%`;
});

const barWidth = computed(() => {
	const { value, maxAbsValue } = props.data;
	if (!value || !maxAbsValue || isNaN(+value)) {
		return 0;
	}

	const absValue = Math.abs(+value);
	const maxAbs = maxAbsValue;
	return Math.min((absValue / maxAbs) * 100, 100);
});

const barColor = computed(() => {

	if (props.data.trend === 'increase') {
		return COLORS.POSITIVE;
	}
	if (props.data.trend === 'decrease') {
		return COLORS.NEGATIVE;
	}

	const numValue = +(props.data.value ?? 0);
	return numValue >= 0 ? COLORS.POSITIVE : COLORS.NEGATIVE;
});
</script>

<template>
	<div
		:class="[
			classes.rootBarCell,
			props.data.maxAbsValue ? classes.leftAlign : ''
		]"
		class="percentCell"
	>
		<span
			class="paragraph-p-00"
			:class="props.data.maxAbsValue ? classes.percentWithBar : ''"
			:style="{ color: barColor }"
		>
			{{ displayValue }}
		</span>
		<div
			v-if="props.data.maxAbsValue"
			:class="classes.bar"
			:style="{
				width: `${barWidth}%`,
				backgroundColor: barColor
			}"
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

.bar {
	min-width: 8px;
	height: 8px;
	border-radius: 4px;
}
</style>
