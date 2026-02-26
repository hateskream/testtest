<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { prettyNumberWithKey } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import type { INonfarmPayrollsChange } from '../../model';

const props = defineProps<{
	primaryValue: string;
	primaryValueUnit: string;
	change: INonfarmPayrollsChange;
}>();

const preparedPrimaryValue = computed(() => {
	const num = parseFloat(props.primaryValue);
	if (Number.isNaN(num)) {
		return props.primaryValue;
	}
	const { row } = prettyNumberWithKey(num);
	return row;
});

const changeLabel = computed(() => {
	return `Payrolls ${props.change.isPositive ? 'up' : 'down'} YoY`;
});

const changeIcon = computed(() => {
	return props.change.direction === 'up' ? IconIds.Gainers : IconIds.Loosers;
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.topValue">
			<ui-text token="title-200">{{ preparedPrimaryValue }}{{ props.primaryValueUnit }}</ui-text>
		</div>
		<div v-if="props.change.value !== null" :class="classes.bottom">
			<ui-text token="text-200-r">{{ changeLabel }}:&nbsp;</ui-text>
			<ui-text
				token="text-200-r"
				:class="[classes.value, props.change.isPositive ? classes.valueUp : classes.valueDown]"
			>
				{{ props.change.isPositive ? '+' : '−' }}{{ props.change.value }}{{ props.change.unit }}
			</ui-text>
			<ui-icon
				v-if="props.change.direction !== 'neutral'"
				:id="changeIcon"
				height="12px"
				width="12px"
				:class="[classes.icon, props.change.isPositive ? classes.iconUp : classes.iconDown]"
			/>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.topValue {
	color: rgb(255 255 255 / 96%);
}

.bottom {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 62%);
}

.value {
	margin-left: 2px;
}

.valueUp {
	color: #04eda0;
}

.valueDown {
	color: #fc1d4d;
}

.icon {
	margin-left: 3px;
}

.iconUp {
	color: #04eda0;
}

.iconDown {
	color: #fc1d4d;
}
</style>
