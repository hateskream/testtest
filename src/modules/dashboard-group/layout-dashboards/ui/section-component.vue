<script setup lang="ts">
import { computed } from 'vue';

import WidgetComponent from './widget-component.vue';

const props = defineProps<{
	width: number;
}>();

const widgets = [
	{ title: 'Market Overview', height: 160 },
	{ title: '7D Fear-Greed Index', height: 100 },
	{ title: 'Market Hours', height: 180 },
	{ title: 'Performance', height: 140 },
	{ title: 'Commodities', height: 160 },
	{ title: 'Crypto Overview', height: 150 },
	{ title: 'Top Gainers', height: 130 },
	{ title: 'Top Losers', height: 130 },
	{ title: 'Sector Summary', height: 170 },
	{ title: 'Currency Exchange', height: 150 },
];

const cardStyle = computed(() => ({ width: `${props.width}px` }));
</script>

<template>
	<section :class="classes.section" :style="cardStyle">
		<h2 :class="classes.sectionTitle">Dashboard Widgets</h2>

		<div :class="classes.scroll">
			<div :class="classes.widgetsContainer">
				<div
					v-for="(widget, i) in widgets"
					:key="i"
					:style="{ height: `${widget.height}px` }"
				>
					<widget-component />
				</div>
			</div>
		</div>
	</section>
</template>

<style module="classes">
.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 12px 16px;
	overflow: auto;
	color: #ffffff;
	border-right: 1px solid #1d1d1e;
}

.sectionTitle {
	margin-bottom: 12px;
	font-style: normal;
	font-weight: 410;
	font-size: 15.5px;
	line-height: 26px;
	letter-spacing: 0.124px;
}

.scroll {
	position: relative;
	flex-grow: 1;
	margin-top: 8px;
	overflow: hidden;
}

.widgetsContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-y: auto;
	scrollbar-width: none;
}

.widgetsContainer > *:not(:last-child) {
	margin-bottom: 16px;
}
</style>
