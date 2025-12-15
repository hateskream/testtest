<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { prettyNumberWithKey } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

interface IMetricTrendBadge {
	topValue: number;
	isTopValuePercent: boolean;
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isGood: boolean;
	isPercent: boolean;
}

const props = defineProps<IMetricTrendBadge>();

const preparedTopValue = computed(() => {
	const { row } = prettyNumberWithKey(props.topValue);
	return row;
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.topValue">
			<ui-text token="title-200">{{ preparedTopValue }}{{ isTopValuePercent ? '%' : '' }}:&nbsp;</ui-text>
		</div>
		<div :class="classes.bottom">
			<ui-text token="text-200-r">{{ label }}:&nbsp;</ui-text>
			<ui-text token="text-200-r" :class="[classes.value, props.isGood ? classes.valueUp : classes.valueDown]">
				{{ isGood ? '+' : '-' }}{{ value }}{{ unit }}
			</ui-text>
			<ui-icon
				:id="props.trend === 'up' ? IconIds.Gainers : IconIds.Loosers"
				height="12px"
				width="12px"
				:class="[classes.icon, props.isGood ? classes.iconUp : classes.iconDown]"
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
