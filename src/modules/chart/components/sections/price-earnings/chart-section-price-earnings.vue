<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetPriceEarnings } from '@/modules/chart/components/widgets/price-earnings';
import type { ISectionProps } from '@/modules/chart/models';
import {
	ChartWidgetEps, ChartWidgetEpsTile, ChartWidgetHistoricalEps,
	type IChartWidgetEpsTileProps,
} from '@/modules/chart/components/widgets';


import type { IPriceEarningsProps } from
	'@/modules/chart/components/widgets/price-earnings/chart-widget-price-earnings.vue';

const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);


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


const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1: IPriceEarningsProps = {
	widgetData: {
		title: 'P/E',
		summary: '51% above sector average',
		status: 'negative',
		ticker: 'TSLA',
	},
	tickerChart: {
		title: 'TSLA',
		minValue: 0,
		maxValue: 30,
		currentValue: 12.9,
		compact: true,
	},
	pncChart: {
		title: 'PNC',
		minValue: 0,
		maxValue: 30,
		currentValue: 11.7,
		compact: true,
	},
	cChart: {
		title: 'C',
		minValue: 0,
		maxValue: 30,
		currentValue: 10.7,
		compact: true,
	},
	msChart: {
		title: 'MS',
		minValue: 0,
		maxValue: 30,
		currentValue: 14.3,
		compact: true,
	},
};

const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2: IPriceEarningsProps = {
	widgetData: {
		title: 'P/E',
		summary: '12% below sector average',
		status: 'positive',
		ticker: 'TRON',
	},
	tickerChart: {
		title: 'TRON',
		minValue: 0,
		maxValue: 30,
		currentValue: 3.9,
		compact: true,
	},
	pncChart: {
		title: 'PNC',
		minValue: 0,
		maxValue: 30,
		currentValue: 22.7,
		compact: true,
	},
	cChart: {
		title: 'C',
		minValue: 0,
		maxValue: 30,
		currentValue: 17.7,
		compact: true,
	},
	msChart: {
		title: 'MS',
		minValue: 0,
		maxValue: 30,
		currentValue: 12.3,
		compact: true,
	},
};

const epsTileData: IChartWidgetEpsTileProps[] = [
	{
		quarter: 'Q1 2025',
		actualEps: 8.41,
		revenue: '$12.73B',
		percentage: '0.14%',
		status: 'success',
		beat: true,
	},
	{
		quarter: 'Q2 2025',
		actualEps: 10.41,
		revenue: '$13.45B',
		percentage: '2.17%',
		status: 'success',
		beat: true,
	},
	{
		quarter: 'Q3 2025',
		actualEps: 12.41,
		revenue: '$14.22B',
		percentage: '3.11%',
		status: 'success',
		beat: true,
	},
	{
		quarter: 'Q4 2025',
		estimatedEps: 12.57,
		revenue: '$14.99B',
		percentage: '',
		status: 'future',
		event: {
			date: 'Apr 14, 8:30 PM',
			time: '8:30 PM',
		},
	},
];
</script>

<template>
	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<chart-widget-eps />
			<div :class="classes.tileContainer">
				<div :class="classes.grid">
					<chart-widget-eps-tile
						v-for="data in epsTileData"
						:key="data.quarter"
						:data="data"
					/>
				</div>

			</div>
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-price-earnings v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
					<chart-widget-price-earnings v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2" />
				</div>
			</div>
			<chart-widget-historical-eps />

		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.container {
	container-type: inline-size;

	.peGroup {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}

	@container (max-width: 599px) {
		.peGroup {
			flex-direction: column;
		}
	}
}


.tileContainer {
	container-type: inline-size;
	width: 100%;

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	@container (max-width: 600px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
}


</style>
