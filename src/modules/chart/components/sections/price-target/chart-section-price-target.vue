<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref, toValue, watch } from 'vue';

import type { ISectionItem } from '@/modules/chart/components';
import { useTabs } from '@/modules/chart/components/shared/composables';
import { ChartCommonTabsLayout } from '@/modules/chart/components/shared/ui';

import ChartCommonSectionLayout from '@/modules/chart/components/shared/ui/chart-common-section-layout.vue';
import ChartWidgetPriceTarget from '@/modules/chart/components/widgets/price-target/chart-widget-price-target.vue';
import ChartWidgetYearlyRevenue
	from '@/modules/chart/components/widgets/yearly-revenue/chart-widget-yearly-revenue.vue';

interface IChartSectionValuationsProps {
	section: ISectionItem;
	activeSection?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
	selectedItem?: string | null;
}

const props = defineProps<IChartSectionValuationsProps>();


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
