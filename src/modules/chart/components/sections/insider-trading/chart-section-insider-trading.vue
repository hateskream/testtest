<script setup lang="ts">


import { onMounted, onUnmounted, ref } from 'vue';


import { type ISectionProps } from '@/modules/chart/models';
import { ChartWidgetInsiderTrading, ChartWidgetTradingVolume } from '@/modules/chart/components/widgets';
import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import type { IBarChartModel } from '@/modules/bar-chart/bar-chart.model.ts';


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);

export interface ITradingVolumeProps {
	widgetData: {
		title: string;
		summary: string;
		ticker: string;
		status: 'negative' | 'positive' | 'neutral';
	};
	charts: IChartData[];
}

interface IChartData extends IBarChartModel {
	period: string;
	value: string;
}

onMounted(() => {
	if (itemRef.value) {
		props.registerItemRef(props.section.id, itemRef.value);
		props.section.items?.forEach((item) => {
			props.registerItemRef(item.id, itemRef.value);
		});

	}
});
onUnmounted(() => {
	props.registerItemRef(props.section.id, null);
	props.section.items?.forEach((item) => {
		props.registerItemRef(item.id, null);
	});
});

const maxValue = 60;
const startValue = 30;


const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1: ITradingVolumeProps = {
	widgetData: {
		title: 'Trading volume',
		summary: 'Cashing out',
		status: 'negative',
		ticker: 'TSLA',
	},
	charts: [
		{
			period: '1-3 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: maxValue,
			startValue: startValue,
			currentValue: -12,
			compact: true,
		},
		{
			period: '3-6 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: maxValue,
			startValue: startValue,
			currentValue: 16,
			compact: true,
		},
		{
			period: '6-9 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: maxValue,
			startValue: startValue,
			currentValue: -5,
			compact: true,
		},
		{
			period: '9-12 month',
			value: '1.69M',
			minValue: 0,
			maxValue: maxValue,
			startValue: startValue,
			currentValue: 5,
			compact: true,
		},
	],
};
</script>
<template>
	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<chart-widget-insider-trading />
			<chart-widget-trading-volume v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">

</style>
