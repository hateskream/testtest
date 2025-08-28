<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetPriceEarnings } from '@/modules/chart/components/widgets/price-earnings';
import type { ISectionProps } from '@/modules/chart/models';

// TODO: move to models
// eslint-disable-next-line @stylistic/max-len
import type { IPriceEarningsProps } from '@/modules/chart/components/widgets/price-earnings/chart-widget-price-earnings.vue';


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

</script>
<template>
	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-price-earnings v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
					<chart-widget-price-earnings v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2" />
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
