<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryNews } from '../queries';
import type { IMeta } from '@/modules/dashboard-group/core';
import { useNews } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

import NewsFiltersPanel from './news-filters-panel-component.vue';
import PreloaderComponent from './preloader-component.vue';
import NewsContextMenu from './news-context-menu.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-news-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	selectedScores,
	selectedSegments,
	selectedSentiment,
	selectedSources,
	displaySettings,
	locations,
	activeLocations,
	selectedTickers,
	sortBy,

	resetAllChanges,
} = useNews(props.meta.widgetId);

const { data, isLoading, isError, refetch } = useQueryNews(computed(() => ({
	score: selectedScores.value,
	segment: selectedSegments.value,
	sentiment: selectedSentiment.value,
	source: selectedSources.value,
	locations: activeLocations.value,
	activeSort: sortBy.value,
	selectedTickers: selectedTickers.value,
	limit: 10,
})));

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>

		</template>
		<template #content>
			<news-filters-panel
				v-model:selected-scores="selectedScores"
				v-model:selected-segments="selectedSegments"
				v-model:selected-sentiment="selectedSentiment"
				v-model:selected-sources="selectedSources"
				v-model:locations="locations"
				v-model:sort-by="sortBy"
			/>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="news"
				:news="news"
				:display-settings="displaySettings"
			/>
		</template>
		<template #rcm>
			<news-context-menu
				v-model:display-settings="displaySettings"
				v-model:selected-scores="selectedScores"
				v-model:selected-segments="selectedSegments"
				v-model:selected-sentiment="selectedSentiment"
				v-model:selected-sources="selectedSources"
				v-model:sort-by="sortBy"
				v-model:locations="locations"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
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
