<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryNews } from '../queries';
import { useNewsStore } from '../stores';
import type { IGetNewsRequest } from '../api';
import type { IMeta } from '@/modules/dashboard-group/model';

import NewsFiltersPanel from './news-filters-panel-component.vue';
import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewNewsComponent from './view-news-component.vue';
import RcmNewsComponent from './rcm-news-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const newsStore = useNewsStore();

const newsArguments = computed<IGetNewsRequest>(() => ({
	source: newsStore.filters.source.value,
	score: newsStore.filters.score.value,
	segment: newsStore.filters.segment.value,
	sentiment: newsStore.filters.sentiment.value,
	dateRange: 'newsStore.filters.dateRange.value',
	sortBy: newsStore.activeSort
		? {
			name: newsStore.activeSort.key,
			order: newsStore.activeSort.order.toUpperCase(),
		}
		: undefined,
	locations: JSON.stringify(newsStore.activeLocationFilters),
}));

const { data, isLoading, isError } = useQueryNews(newsArguments.value);

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>

		</template>
		<template #content>
			<news-filters-panel />
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-news-component
				v-else-if="data"
				:news="data"
			/>
		</template>
		<template #rcm>
			<rcm-news-component />
		</template>
	</base-dashboard-component>
</template>
<style module="classes">
.titleContainer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
</style>
