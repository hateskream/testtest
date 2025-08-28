<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';

import type { ISectionProps } from '@/modules/chart/models';
import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import {
	ChartWidgetAnnualMarginTrends,
	ChartWidgetBalanceSheet,
	ChartWidgetIncomeStatement,
} from '@/modules/chart/components/widgets';
import { ChartWidgetAnnualReturns } from '@/modules/chart/components/widgets/annual-returns';
import type { IBarChartModel } from '@/modules/bar-chart/bar-chart.model.ts';
interface IChartData extends IBarChartModel {
	period: string;
	value: string;
}
export interface IAnnualReturnsProps {
	widgetData: {
		title: string;
		summary: string;
		ticker: string;
		status: 'negative' | 'positive' | 'neutral';
	};
	charts: IChartData[];
}


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);

const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1: IAnnualReturnsProps = {
	widgetData: {
		title: 'Annual returns',
		summary: 'Below Average',
		status: 'negative',
		ticker: 'TSLA',
	},
	charts: [
		{
			label: 'TSLA',
			value: -38.95,
		},
		{
			label: 'Financial',
			value: -25.72,
			pale: true,
		},
		{
			label: 'US Market',
			value: -21.34,
			pale: true,
		},
	],
};


// Register the ref when component mounts
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

</script>

<template>


	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<chart-widget-balance-sheet />
			<chart-widget-income-statement />
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-annual-returns v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
					<chart-widget-annual-margin-trends />
				</div>
			</div>

		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.peGroup {
	display: flex;
	flex-direction: row;
	gap: 4px;
}

.container {
	container-type: inline-size;
}

@container (max-width: 599px) {
	.peGroup {
		flex-direction: column;
	}
}

</style>
