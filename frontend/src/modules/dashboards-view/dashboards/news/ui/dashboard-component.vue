<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryNews } from '../queries';
import { useNewsStore } from '../stores';
import type { IGetNewsRequest } from '../api';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewNewsComponent from './view-news-component.vue';
import RcmNewsComponent from './rcm-news-component.vue';
import NewsFiltersPanel from './news-filters-panel-component.vue';

const newsStore = useNewsStore();

const newsArguments = computed<IGetNewsRequest>(() => ({
	source: newsStore.filters.source.value,
	score: newsStore.filters.score.value,
	segment: newsStore.filters.segment.value,
	sentiment: newsStore.filters.sentiment.value,
	dateRange: 'newsStore.filters.dateRange.value',

	locations: JSON.stringify(newsStore.activeLocationFilters),
}));

const { data, isLoading, isError } = useQueryNews(newsArguments.value);

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title>
			<news-filters-panel />
		</template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-news-component
				v-else-if="data"
				:news="data"
			/>
		</template>
		<template #rcm="{ positions }">
			<rcm-news-component :positions="positions" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 1.8;
	flex-basis: 0;
}
</style>
