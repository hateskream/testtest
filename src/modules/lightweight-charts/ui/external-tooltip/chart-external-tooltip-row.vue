<script setup lang="ts">
import { type CSSProperties } from 'vue';

import { UiText } from '@/shared/ui/text';

interface IChartExternalTooltipRowProps {
	color: CSSProperties['background-color'];
	text: string;
	value: string;
}

const props = defineProps<IChartExternalTooltipRowProps>();
</script>

<template>
	<div :class="classes.row">
		<div :class="classes.left">
			<span :class="classes.dot" :style="{ background: props.color }" />
			<ui-text token="text-200-r">{{ props.text }}</ui-text>
		</div>
		<ui-text token="text-200-b">{{ props.value }}</ui-text>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 26px;
}

.left {
	display: flex;
	align-items: center;
	gap: 4px;
}

.dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-width: 2px;
	border-radius: 20px;
}
</style>
