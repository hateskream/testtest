<script setup lang="ts">


import { computed, ref } from 'vue';

import type { ISectionProps } from '@/modules/chart/models';
import { ChartCommonSectionLayout, ChartCommonTabsLayout } from '@/modules/chart/components/shared/ui';
import { useTabs } from '../../shared/composables';
import {
	ChartWidgetFearGreed,
	ChartWidgetKeyIndicators,
	ChartWidgetNews, ChartWidgetKeyStats, ChartWidgetLinks,
} from '@/modules/chart/components/widgets';
import { markdown } from './markdown.ts';
import { IconIds } from '@/shared/ui/icon';


const props = defineProps<ISectionProps>();

const tabs = computed(() => [
	{ id: 'insights-and-activity-insights', title: 'Insights' },
	{ id: 'insights-and-activity-news', title: 'News' },
],
);

const smallTabs = computed(() => [
	{ id: 'insights-and-activity-links', title: 'Links' },
	{ id: 'insights-and-activity-about', title: 'About' },
],
);


const { activeTab, tabList, setActiveTab } = useTabs(tabs);
const { activeTab: smallActiveTab, tabList: smallTabList, setActiveTab: setSmallActiveTab } = useTabs(smallTabs);


const marketDate = {
	marketCap: 3252255,
	volume: '151 703 351',
	totalReturn3M: -29.5,
	totalReturn1Y: 53.952,
	forwardPE: '151 703 351',
	sector: 'Automobiles',
};

const markdownText = ref(markdown);

const keyIndicatorsData = {
	indicators: [
		{
			icon: IconIds.MetricDown,
			text: 'Trading at +0.74% premium to NAV',
		},
		{
			icon: IconIds.MetricUp,
			text: '$1.43B net inflows in the last month',
		},
		{
			icon: IconIds.MetricUp,
			text: 'Outperforming S&P 500 by 2.16% YTD',
		},
		{
			icon: IconIds.MetricHold,
			text: 'Top holding subtracted 0.01% to YTD returns',
		},
	],
	time: '19:30',
};


</script>
<template>
	<chart-common-section-layout>
		<template #title><span>{{ props.section.title }}</span></template>
		<template #body>
			<chart-widget-key-stats :market-data="marketDate" />
			<chart-common-tabs-layout
				:active-tab="activeTab"
				:tab-list="tabList"
				:set-active-tab="setActiveTab"
			>
				<template #insights-and-activity-insights>
					<div :class="classes.tabWrapper">
						<chart-widget-fear-greed />
					</div>
				</template>
				<template #insights-and-activity-news>
					<div :class="classes.tabWrapper">
						<chart-widget-news :markdown-text="markdownText"></chart-widget-news>
					</div>
				</template>
				<template #common>
					<chart-widget-key-indicators
						:indicators="keyIndicatorsData.indicators"
						:time="keyIndicatorsData.time"
					/>
				</template>

			</chart-common-tabs-layout>
			<chart-common-tabs-layout
				:active-tab="smallActiveTab"
				:tab-list="smallTabList"
				:set-active-tab="setSmallActiveTab"
			>
				<template #insights-and-activity-links>

					<chart-widget-links />

				</template>
				<template #insights-and-activity-about>

					<chart-widget-links />

				</template>

			</chart-common-tabs-layout>

		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.tabWrapper {
	height: 400px;
}
</style>
