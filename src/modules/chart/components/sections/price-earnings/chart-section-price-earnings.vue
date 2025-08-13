<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetPriceEarnings } from '@/modules/chart/components/widgets/price-earnings';
import type { ISectionItem } from '@/modules/chart/components';

interface IChartSectionValuationsProps {
	section: ISectionItem;
	selectedItem?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

const props = defineProps<IChartSectionValuationsProps>();


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

</script>
<template>
	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<chart-widget-price-earnings />
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">

</style>
