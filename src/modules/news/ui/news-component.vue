<script setup lang="ts">
import { type INews } from '../model/news';
import type { IDisplaySettings } from '../model';

import TvNewsComponent from '@/modules/news/ui/tv/tv-news-component.vue';
import DashboardNewsComponent from '@/modules/news/ui/dashboard/dashboard-news-component.vue';

interface INewsComponent {
	news: INews;
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<INewsComponent>();
</script>

<template>
	<tv-news-component v-if="displayVariant === 'tv'" v-bind="props" />
	<dashboard-news-component v-else v-bind="props" />
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	padding: 14px 12px;
	border-radius: 18px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	gap: 6px;
}

.container:hover {
	background-color: var(--bg-color-base-100-effect);
}

.newsLeftImageWrapper {
	flex: 0 0 18px;
	height: 18px;
}

.newsContent {
	flex: 1 1 100%;
}

.newsLeftImage {
	border-radius: 4px;
	object-fit: cover;
}

.newsOtherAuthorText {
	transition: color 0.3s ease;
}

.newsOtherAuthorText:hover {
	color: var(--text-color-base-300-effect);
	cursor: pointer;
}

.newsTitle {
	margin-bottom: 6px;
}

.newsTitle > h3 {
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-500);
}

.newsDesc {
	margin-bottom: 6px;
}

.newsDesc > p {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.newsOther {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	padding-right: 32px;
}

.newsOtherText {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.newsStocks {
	display: flex;
}

.newsStock {
	width: 20px;
	height: 20px;
	margin-left: -6px;
	overflow: hidden;
	border: 2px solid #222223;
	border-radius: 16px;
	cursor: pointer;
}

.newsStocks > div:first-child .newsStock {
	margin-left: 0;
}

.newsStockImage {
	object-fit: cover;
}
</style>
