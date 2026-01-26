<script setup lang="ts">
import { type Component, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppLayout } from '@/modules/layout';
import { UiPillItem } from '@/shared/ui/pill';
import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';

const widgets: ITickerWidgetConfig[] = [
	{
		name: 'activity-metrics',
		title: 'Activity Metrics',
		widget: ActivityMetricsTickerWidget,
		tickers: [
			'Crypto-BTC_Bitcoin',
			'Stock-TSLA',
			'Index-SPX',
			'Commodity-Gold',
			'Forex-USD',
			'Etf-SPY',
		],
	},
] as const;

const DEFAULT_COLUMN_WIDTH = 320;


interface ITickerWidgetConfig {
	name: string;
	title: string;
	widget: Component;
	tickers: string[];
}

interface ITickerPageProps {
	widgetName: string;
}

const props = defineProps<ITickerPageProps>();

const selectedConfig = computed(() => widgets.find(config => config.name === props.widgetName));
const widget = computed(() => selectedConfig.value?.widget);

const router = useRouter();

function openWidget(widgetName: string) {
	if (widgetName === props.widgetName) {
		return;
	}

	router.replace({ params: { widgetName } });
}

const width = ref(DEFAULT_COLUMN_WIDTH);

const widthInPx = computed(() => `${width.value + 38}px`);
</script>

<template>
	<app-layout>
		<div :class="classes.root">
			<div :class="classes.container">
				<div :class="classes.options">
					<span>Available Widgets:</span>
					<ui-pill-item
						v-for="config in widgets"
						:key="config.name"
						:model-value="props.widgetName === config.name"
						display-variant="new"
						@click="openWidget(config.name)"
					>
						{{ config.title }}
					</ui-pill-item>
				</div>
				<div :class="classes.info">
					<div>Widget: {{ selectedConfig ? props.widgetName : 'Not Found' }}</div>
					<div :class="classes.size">
						<span>Size:</span>
						<input
							v-model.number="width"
							:class="classes.sizeRange"
							type="range"
							min="200"
							step="10"
							max="2000"
						/>
						<input
							v-model.number="width"
							type="number"
							:class="classes.sizeInput"
						/>
						<ui-pill-item display-variant="new" @click="width = DEFAULT_COLUMN_WIDTH">Reset</ui-pill-item>
					</div>
				</div>
				<div
					v-if="selectedConfig"
					:class="classes.widgets"
					:style="{ width: widthInPx }"
				>
					<div
						v-for="ticker in selectedConfig.tickers"
						:key="ticker"
						:class="classes.ticker"
					>
						<ui-pill-item display-variant="new" :class="classes.tickerName">{{ ticker }}</ui-pill-item>
						<widget
							:meta="{
								tickerId: ticker
							}"
							:class="classes.widget"
						/>
					</div>
				</div>
			</div>
		</div>
	</app-layout>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow-x: hidden;
}

.container {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0;
	padding: 20px;
	overflow: hidden;
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

.options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin-bottom: 30px;
	gap: 5px;
}

.info {
	display: flex;
	gap: 20px;
	align-items: center;
}

.size {
	display: flex;
	gap: 5px;
	align-items: center;
}

.sizeRange {
	width: 200px;
}

.sizeInput {
	width: 50px;
}

.widgets {
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	margin-right: -10px;
	padding-right: 10px;
	overflow-y: auto;
	gap: 10px;
}

.ticker {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border: 1px solid #1d1d1e;
}

.tickerName {
	max-width: max-content;
	margin-bottom: 10px;
}
</style>
