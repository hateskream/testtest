<script setup lang="ts">
import { ref } from 'vue';

import { TickerBaseTabsLayout, TickerBaseListDivider } from '@/modules/ticker/ui/__base__';
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerNewsWidget } from '@/modules/news';
import { EconomicOutlineTickerWidget } from '@/modules/widgets/economic-outline';
import { CurrentSentimentTickerWidget } from '@/modules/widgets/current-sentiment';

const tabs = [
	{ id: 'insights', title: 'Insights' },
	{ id: 'news', title: 'News' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const selectedTabId = ref<TabId>('insights');

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<ticker-base-tabs-layout v-model="selectedTabId" :tabs="tabs">
			<template #insights>
				<current-sentiment-ticker-widget :meta="{tickerId}" />

				<ticker-base-list-divider />

				<economic-outline-ticker-widget :meta="{tickerId}" />

				<ticker-base-list-divider />

				<ticker-key-indicators-widget :meta="{tickerId}" />
			</template>

			<template #news>
				<ticker-news-widget :meta="{tickerId}" />
			</template>
		</ticker-base-tabs-layout>
	</div>
</template>

<style module="classes">
.section {
	width: 100%;
}
</style>
