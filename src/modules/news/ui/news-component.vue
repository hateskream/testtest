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
