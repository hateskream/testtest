<script setup lang="ts">


import { computed } from 'vue';

import { ChartWidgetsKeyStats } from '../../widgets';
import { ChartCommonSectionLayout, ChartCommonTabsLayout } from '../../shared/ui';
import { useTabs } from '../../shared/composables';

const tabs = computed(() => [
	{ id: 'insights-and-activity-insights', title: 'Insights' },
	{ id: 'insights-and-activity-news', title: 'News' },
],
)
;


const { activeTab, tabList, setActiveTab } = useTabs(tabs);


const marketDate = {
	marketCap: 3252255,
	volume: '151 703 351',
	totalReturn3M: -29.5,
	totalReturn1Y: 53.952,
	forwardPE: '151 703 351',
	sector: 'Automobiles',
};
</script>

<template>
	<chart-common-section-layout>
		<template #title><span>Insights & Activity</span></template>
		<template #body>
			<chart-widgets-key-stats :market-data="marketDate" />
			<chart-common-tabs-layout
				:active-tab="activeTab"
				:tab-list="tabList"
				:set-active-tab="setActiveTab"
			>
				<template #insights-and-activity-insights>1234 </template>
				<template #insights-and-activity-news>321</template>
				<template #common> AAA </template>

			</chart-common-tabs-layout>

		</template>
	</chart-common-section-layout>
</template>

<style module="classes">


.titleIcon {
	color: #ffffff;
}

</style>
