<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetAnnualReturns } from '@/modules/chart/components/widgets/annual-returns';
import type { ISectionProps } from '@/modules/chart/models';

// TODO: move to models
// eslint-disable-next-line @stylistic/max-len
import type { IAnnualReturnsProps } from '@/modules/chart/components/widgets/annual-returns/chart-widget-annual-returns.vue';


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

const idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2: IAnnualReturnsProps = {
	widgetData: {
		title: 'Annual returns',
		summary: 'Above Average',
		status: 'positive',
		ticker: 'TSLA',
	},
	charts: [
		{
			label: 'TSLA',
			value: 38.95,
		},
		{
			label: 'Financial',
			value: 25.72,
			pale: true,
		},
		{
			label: 'US Market',
			value: 21.34,
			pale: true,
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
					<chart-widget-annual-returns v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps1" />
					<chart-widget-annual-returns v-bind="idkHowToPassDataIntoWidgetsSoIWillJustPassItAsProps2" />
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
