<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { prettyNumberWithKey } from '@/shared/lib';

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
			<span>{{ preparedTopValue }} {{ isTopValuePercent ? '%' : '' }}</span>
		</div>
		<div :class="classes.bottom">
			<span>{{ label }}:&nbsp;</span>
			<span :class="[classes.value, props.isGood ? classes.valueUp : classes.valueDown]">
				{{ isGood ? '+' : '-' }}{{ value }}{{ unit }}
			</span>
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
	font-weight: 440;
	font-size: 16.8px;
	line-height: 160%;
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.134px;
}

.bottom {
	display: flex;
	align-items: center;
	font-weight: 400;
	font-size: 13.3px;
	line-height: 180%;
	color: rgb(255 255 255 / 62%);
	letter-spacing: 0.146px;
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
