<script setup lang="ts">
import { markRaw, ref } from 'vue';

import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { TickerLinksWidget } from '@/modules/widgets/links';
import { useTickerContext } from '@/modules/ticker/composables';
import type { ISectionItem } from '@/modules/ticker/models';
import { TickerBaseTabsLayout } from '@/modules/ticker';

import TabInsightsContent from './tab-insights-content.vue';
import TabNewsContent from './tab-news-content.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const tabs = [
	{ id: 'insights', title: 'Insights', component: markRaw(TabInsightsContent) },
	{ id: 'news', title: 'News', component: markRaw(TabNewsContent) },
];

const selectedTabId = ref<string | number>('insights');
</script>

<template>
	<div :class="classes.section">
		<activity-metrics-ticker-widget :meta="{ tickerId, name: 'Activity Metrics' }" />
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs" />
		<ticker-links-widget :meta="{ tickerId, name: 'Insights' }" />
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}
</style>
