<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import { ChartExternalTooltipRow } from '@/modules/lightweight-charts';

interface IMarketCapChartTooltipProps {
	color: CSSProperties['background-color'];
	value: number | string;
	title: string;
}

const props = defineProps<IMarketCapChartTooltipProps>();

// TODO: После подключения к АПИ нужно будет парсить через PrettyNumber для единиц (K, T, B, M, etc)
const preparedValue = computed(() => `$${props.value}`);
</script>

<template>
	<div :class="classes.tooltip">
		<chart-external-tooltip-row
			:color="props.color"
			text="Market Cap"
			:value="preparedValue"
		/>
		<p :class="classes.title">{{ title }}</p>
	</div>
</template>

<style module="classes">
.tooltip {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.title {
	font-size: 10px;
	color: var(--text-color-base-300);
}
</style>
