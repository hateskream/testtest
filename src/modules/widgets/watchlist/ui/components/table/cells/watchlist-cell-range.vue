<script setup lang="ts">
import { computed } from 'vue';

import type { IWatchlistRangeCell } from '../../../../model';

interface IProps {
	cell: IWatchlistRangeCell;
}

const props = defineProps<IProps>();

const formatValue = (value?: string, magnitude?: string) => {
	if (!value) {
		return '';
	}
	const formatted = parseFloat(value).toLocaleString('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return magnitude ? `${formatted}${magnitude}` : formatted;
};

const formattedRange = computed(() => {
	if (!props.cell.startValue || !props.cell.endValue) {
		return '—';
	}

	const startFormatted = formatValue(props.cell.startValue, props.cell.startMagnitude);
	const endFormatted = formatValue(props.cell.endValue, props.cell.endMagnitude);
	const currency = props.cell.currencySymbol || '';

	return `${currency}${startFormatted} - ${currency}${endFormatted}`;
});
</script>

<template>
	<div :class="classes.range">
		{{ formattedRange }}
	</div>
</template>

<style module="classes">
.range {
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-500);
	letter-spacing: 0.143px;
	white-space: nowrap;
}
</style>
