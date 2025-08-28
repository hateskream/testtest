<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { type ISectionProps } from '@/modules/chart/models';
import {
	ChartWidgetValuation,
	ChartWidgetsCapitalStructure,
	ChartWidgetYearlyRevenue, ChartWidgetPriceTarget, ChartWidgetQuarterlyRevenue,
} from '@/modules/chart/components/widgets';
import { ChartCommonSectionLayout, ChartCommonTabsLayout } from '@/modules/chart/components/shared/ui';
import { useTabs } from '@/modules/chart/components/shared/composables';


const props = defineProps<ISectionProps>();


const valuationData = {
	pe: { ltm: '161.4', ntm: '132.7' },
	evSales: { ltm: '9.3', ntm: '8.8' },
	evEbitda: { ltm: '62.7', ntm: '54.5' },
	priceBook: { ltm: '12.2', ntm: null },
};

const capitalStructureData = {
	marketCap: '920.81B',
	totalDebt: '161.4x',
	cashAndInv: '9.3x',
	enterpriseValue: '62.7x',
};

const itemRef = ref<HTMLElement | null>(null);

const tabsFirst = computed(() => {
	if (!props.section?.items || !Array.isArray(props.section.items)) {
		return [];
	}

	return props.section.items.filter(el => el.group === 'tab-group-1');
});

const { activeTab:activeTabFirst, tabList:tabListFirst, setActiveTab:setActiveTabFirst } = useTabs(tabsFirst);

const tabsSecond = computed(() => {
	if (!props.section?.items || !Array.isArray(props.section.items)) {
		return [];
	}

	return props.section.items.filter(el => el.group === 'tab-group-2');
});




const { activeTab:activeTabSecond, tabList:tabListSecond, setActiveTab:setActiveTabSecond } = useTabs(tabsSecond);


watch(() => props.selectedItem, (newSelectedItem) => {
	if (!newSelectedItem) {
		return;
	}
	let newTab = tabsFirst.value.find(el => el.id === newSelectedItem);
	if (newTab) {
		setActiveTabFirst(newTab.id);
		return;
	}

	newTab = tabsSecond.value.find(el => el.id === newSelectedItem);
	if (newTab) {
		setActiveTabSecond(newTab.id);
		return;
	}


});

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
			<div :class="classes.container">
				<div :class="classes.section">
					<chart-widget-valuation :values="valuationData" />
					<chart-widgets-capital-structure :values="capitalStructureData" />
				</div>
			</div>
			<chart-common-tabs-layout
				:active-tab="activeTabFirst"
				:tab-list="tabListFirst"
				:set-active-tab="setActiveTabFirst"
			>
				<template #price-target-history><chart-widget-price-target /></template>
				<template #price-target-analysis><chart-widget-yearly-revenue /></template>
			</chart-common-tabs-layout>
			<div :class="classes.split" />
			<chart-common-tabs-layout
				:active-tab="activeTabSecond"
				:tab-list="tabListSecond"
				:set-active-tab="setActiveTabSecond"
			>
				<template #quarterly-revenue><chart-widget-quarterly-revenue /></template>
				<template #yearly-revenue><chart-widget-yearly-revenue /></template>
			</chart-common-tabs-layout>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.container {
	container-type: inline-size;
}

.section {
	display: flex;
	gap: 3px;
}
.split {
	height: 3px;
	width:0;
}
@container (max-width: 599px) {
	.section {
		flex-direction: column;
	}
}
</style>
