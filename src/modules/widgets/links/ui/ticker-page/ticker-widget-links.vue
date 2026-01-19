<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

import { ChartCommonTabsLayout } from '@/modules/chart/components/shared/ui';
import { useTabs } from '@/modules/chart/components/shared/composables';
import { getLinksTabs } from '@/modules/widgets/links/api/get-links-tabs.ts';

import WidgetLinkItem from '@/modules/widgets/links/ui/widget-link-item.vue';

const { data } = useQuery({
	queryKey: ['ticker-widget', 'tabs'],
	queryFn: getLinksTabs,
});

const tabs = [
	{ id: 'insights-and-activity-links', title: 'Links' },
	{ id: 'insights-and-activity-about', title: 'About' },
];

const { activeTab, tabList, setActiveTab } = useTabs(tabs);

function getItem(index: number) {
	return data.value?.tabs[index];
}
</script>

<template>
	<chart-common-tabs-layout
		:active-tab="activeTab"
		:tab-list="tabList"
		:set-active-tab="setActiveTab"
	>
		<template
			v-for="(tab, index) in tabs"
			:key="tab.id"
			#[tab.id]
		>
			<widget-link-item :content="getItem(index)" />
		</template>
	</chart-common-tabs-layout>
</template>

<style scoped>

</style>
