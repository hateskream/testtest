<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';

import type { ISectionItem } from '@/modules/chart/components';

import ChartCommonSectionLayout from '@/modules/chart/components/shared/ui/chart-common-section-layout.vue';
import ChartWidgetStockPeersBulk
	from '@/modules/chart/components/widgets/stock-peers-bulk/chart-widget-stock-peers-bulk.vue';

interface IChartSectionValuationsProps {
	section: ISectionItem;
	selectedItem?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

const props = defineProps<IChartSectionValuationsProps>();


const itemRef = ref<HTMLElement | null>(null);

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
		<template #refAnchor><div ref="itemRef"></div></template>
		<template #title>{{props.section?.title}}</template>
		<template #body>
			<chart-widget-stock-peers-bulk />
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">


</style>
