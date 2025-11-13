<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IMetricTrendBadge {
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isPercent: boolean;
}

const props = defineProps<IMetricTrendBadge>();
</script>

<template>
	<div :class="[classes.container, classes[props.trend]]">
		<span>{{ label }}:&nbsp;</span>
		<span :class="classes.value">{{ value }} {{ props.isPercent && '%' }} {{ unit }}</span>
		<ui-icon
			:id="props.trend === 'up' ? IconIds.Gainers : IconIds.Loosers"
			height="12px"
			width="12px"
			:class="classes.icon"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	height: 24px;
	padding: 3px 6px;
	font-style: normal;
	font-weight: 400;
	font-size: 12.2px;
	line-height: 180%;
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.122px;
	background: rgb(73 73 80 / 22%);
	border-radius: 6px;
}

.up > .value {
	color: #04eda0;
}

.down > .value {
	color: #fc1d4d;
}

.icon {
	margin-left: 3px;
}

.up > .icon {
	color: #04eda0;
}

.down > .icon {
	color: #fc1d4d;
}
</style>
