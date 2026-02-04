<script setup lang="ts">
import { ref } from 'vue';

import { TickerBaseTabsLayout, TickerBaseListDivider } from '@/modules/ticker/ui/__base__';
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerNewsWidget } from '@/modules/news';
import { UiText } from '@/shared/ui/text';

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
				<div :class="classes.item">
					<div :class="classes.head">
						<ui-text token="title-100">The economic outline is</ui-text>
						<div :class="classes.status">
							<ui-text token="text-200-r">
								Optimistic
							</ui-text>
						</div>
					</div>
					<div :class="classes.body">
						<ui-text token="text-200-r" :class="classes.text">
							UK's MPC votes shifted to 0-1-8, Bank Rate stable at 4.5%.
							SNB lowers rate to 0.25%. AU job losses surged to 52.8K, UK claimants up to 44.2K.
						</ui-text>

						<ui-text token="text-100-r" :class="classes.summarized">
							Summarized at 19:30
						</ui-text>
					</div>
				</div>

				<ticker-base-list-divider />

				<div :class="classes.item">
					<div :class="classes.head">
						<ui-text token="title-100">Key indicators</ui-text>
					</div>
					<ticker-key-indicators-widget :meta="{tickerId}" />
				</div>

				<ticker-base-list-divider />
			</template>

			<template #news>
				<div :class="classes.item">
					<div :class="classes.head">
						<ui-text token="title-100">B</ui-text>
					</div>
					<ticker-news-widget :meta="{tickerId}" />
				</div>
			</template>
		</ticker-base-tabs-layout>
	</div>
</template>

<style module="classes">
.section {
	width: 100%;
}

.item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
}

.head {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: 4px var(--padding-padding-s3, 4px);
}

.status {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: var(--tile-padding-md-gap, 3px) var(--tile-padding-md-out, 6px);
	color: var(--success-success-00, #04eda0);
	background: var(--success-success-90, rgb(4 237 160 / 10%));
	border-radius: var(--radius-radius-s9-16, 6px);
	gap: var(--tile-padding-md-gap, 3px);
}

.body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s5, 8px);
}

.text {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.summarized {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.widget {
	width: 100%;
}
</style>
