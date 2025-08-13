<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';


import { useTabs } from '@/modules/chart/components/shared/composables';
import { ChartCommonTabsLayout, ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetPriceTarget, ChartWidgetYearlyRevenue } from '@/modules/chart/components/widgets';
import type { ISectionProps } from '@/modules/chart/models';


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);


const tabs = computed(() => {
	if (!props.section?.items || !Array.isArray(props.section.items)) {
		return [];
	}

	return props.section.items;
});

const { activeTab, tabList, setActiveTab } = useTabs(tabs);

watch(() => props.selectedItem, (newSelectedItem) => {
	if (!newSelectedItem) {
		return;
	}
	const newTab = tabs.value.find(el => el.id === newSelectedItem);
	if (newTab) {
		setActiveTab(newTab.id);
	}
});

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

			<chart-common-tabs-layout
				:active-tab="activeTab"
				:tab-list="tabList"
				:set-active-tab="setActiveTab"
			>
				<template #price-target-history><chart-widget-price-target /></template>
				<template #price-target-analysis><chart-widget-yearly-revenue /></template>
			</chart-common-tabs-layout>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.section {
	display: flex;
	gap: 3px;
}


</style>
