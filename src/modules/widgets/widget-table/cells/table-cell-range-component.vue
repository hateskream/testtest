<script setup lang="ts">
import { computed } from 'vue';

import type { ITableRangeCell } from '../model';

interface IProps {
	data: ITableRangeCell;
}

const props = defineProps<IProps>();

const formattedRange = computed(() => {
	// Fallback for missing data
	if (!props.data?.startValue || !props.data?.endValue) {
		return {
			prefix: '',
			startValue: '—',
			startSuffix: '',
			separator: '',
			endValue: '',
			endSuffix: '',
		};
	}

	const { startValue, endValue, currencySymbol = '', startMagnitude = '', endMagnitude = '' } = props.data;

	return {
		prefix: currencySymbol,
		startValue,
		startSuffix: startMagnitude,
		separator: ' - ',
		endValue,
		endSuffix: endMagnitude,
	};
});
</script>

<template>
	<div :class="classes.range" class="text-300-r">
		<span v-if="formattedRange.prefix" :class="classes.prefix">{{ formattedRange.prefix }}</span>
		<span :class="classes.value">{{ formattedRange.startValue }}</span>
		<span v-if="formattedRange.startSuffix" :class="classes.suffix">{{ formattedRange.startSuffix }}</span>
		<span :class="classes.separator">{{ formattedRange.separator }}</span>
		<span :class="classes.value">{{ formattedRange.endValue }}</span>
		<span v-if="formattedRange.endSuffix" :class="classes.suffix">{{ formattedRange.endSuffix }}</span>
	</div>
</template>

<style module="classes">
.range {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	line-height: 1;
	white-space: nowrap;
}

.prefix {
	margin-right: 2px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-100);
}

.value {
	color: var(--text-color-base-500);
}

.suffix {
	margin-left: 2px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.separator {
	margin: 0 2px;
	color: var(--text-color-base-300);
}
</style>
