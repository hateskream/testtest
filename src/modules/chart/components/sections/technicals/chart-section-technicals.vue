<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { ChartCommonSectionLayout, ChartCommonTabsLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetMovingAverages, ChartWidgetOscillators, ChartWidgetOscillatorsTable } from
	'@/modules/chart/components/widgets';
import type { ISectionProps } from '@/modules/chart/models';
import { useTabs } from '@/modules/chart/components/shared/composables';


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);

const tabsFirst = computed(() => {
	if (!props.section?.items || !Array.isArray(props.section.items)) {
		return [];
	}

	return props.section.items.filter(el => el.group === 'tab-group-1');
});

const { activeTab:activeTabFirst, tabList:tabListFirst, setActiveTab:setActiveTabFirst } = useTabs(tabsFirst);


watch(() => props.selectedItem, (newSelectedItem) => {
	if (!newSelectedItem) {
		return;
	}
	let newTab = tabsFirst.value.find(el => el.id === newSelectedItem);
	if (newTab) {
		setActiveTabFirst(newTab.id);
		return;
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
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-oscillators />
					<chart-widget-moving-averages />
				</div>
				<chart-common-tabs-layout
					:active-tab="activeTabFirst"
					:tab-list="tabListFirst"
					:set-active-tab="setActiveTabFirst"
				>
					<template #oscillators><chart-widget-oscillators-table /></template>
					<template #moving-averages><chart-widget-oscillators-table /></template>
				</chart-common-tabs-layout>


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
