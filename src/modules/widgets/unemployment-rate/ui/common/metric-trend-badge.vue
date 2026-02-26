<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import type { IUnemploymentRateChange } from '../../model';

interface IMetricTrendBadgeProps {
	primaryValue: string;
	primaryValueUnit: string;
	change: IUnemploymentRateChange;
}

const props = defineProps<IMetricTrendBadgeProps>();

const topValueLabel = computed(() => `${props.primaryValue}${props.primaryValueUnit}`);
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.topValue">
			<ui-text token="title-200">{{ topValueLabel }}</ui-text>
		</div>
		<div v-if="props.change.value !== null" :class="classes.bottom">
			<ui-text token="text-200-r">Rate {{ props.change.isPositive ? 'down' : 'up' }} YoY:&nbsp;</ui-text>
			<ui-text
				token="text-200-r"
				:class="[classes.value, props.change.isPositive ? classes.valueUp : classes.valueDown]"
			>
				{{ props.change.isPositive ? '-' : '+' }}{{ props.change.value }}{{ props.change.unit }}
			</ui-text>
			<ui-icon
				v-if="props.change.direction !== 'neutral'"
				:id="props.change.direction === 'up' ? IconIds.Gainers : IconIds.Loosers"
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
