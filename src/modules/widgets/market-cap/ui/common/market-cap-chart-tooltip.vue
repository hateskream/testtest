<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import { ChartExternalTooltipRow } from '@/modules/lightweight-charts';
import { UiText } from '@/shared/ui/text';

interface IMarketCapChartTooltipProps {
	color: CSSProperties['background-color'];
	value: number | string;
	title: string;
}

const props = defineProps<IMarketCapChartTooltipProps>();

const preparedValue = computed(() => props.value.toString());
</script>

<template>
	<div :class="classes.tooltip">
		<chart-external-tooltip-row
			:color="props.color"
			text="Market Cap"
			:value="preparedValue"
		/>
		<ui-text token="text-100-r" :class="classes.title">{{ title }}</ui-text>
	</div>
</template>

<style module="classes">
.tooltip {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.title {
	color: var(--text-color-base-300);
}
</style>
