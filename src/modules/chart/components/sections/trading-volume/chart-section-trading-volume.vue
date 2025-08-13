<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetTradingVolume } from '@/modules/chart/components/widgets/trading-volume';
import type { ISectionProps } from '@/modules/chart/models';

// TODO: move to models
// eslint-disable-next-line @stylistic/max-len
import type { ITradingVolumeProps } from '@/modules/chart/components/widgets/trading-volume/chart-widget-trading-volume.vue';


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
			maxValue: 100,
			startValue: 50,
			currentValue: -12,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '3-6 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: -24,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '6-9 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: -5,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '9-12 month',
			value: '1.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: 5,
			coloredStatus: 'positive',
			compact: true,
		},
	],
};

const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2: ITradingVolumeProps = {
	widgetData: {
		title: 'Trading volume',
		summary: 'Cashing in',
		status: 'positive',
		ticker: 'TSLA',
	},
	charts: [
		{
			period: '1-3 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: -12,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '3-6 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: -24,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '6-9 month',
			value: '-19.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: -5,
			coloredStatus: 'negative',
			compact: true,
		},
		{
			period: '9-12 month',
			value: '1.69M',
			minValue: 0,
			maxValue: 100,
			startValue: 50,
			currentValue: 5,
			coloredStatus: 'positive',
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
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-trading-volume v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
					<chart-widget-trading-volume v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2" />
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
