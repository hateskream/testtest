<script setup lang="ts">
import { markRaw, ref } from 'vue';

import { TickerBaseTabsLayout } from '@/modules/ticker/ui/base';

import TabInsightsContent from './tab-insights-content.vue';
import TabNewsContent from './tab-news-content.vue';

const tabs = [
	{ id: 'insights', title: 'Insights', component: markRaw(TabInsightsContent) },
	{ id: 'news', title: 'News', component: markRaw(TabNewsContent) },
];

const selectedTabId = ref<string | number>('insights');
</script>

<template>
	<div :class="classes.section">
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs" />
	</div>
</template>

<style module="classes">
.section {
	width: 100%;
}
</style>
