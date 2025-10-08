<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';
import {
	type IGetNewsRequest,
	NewsFiltersPanel,
	useNews,
	useQueryNews,
} from '@/modules/news';

import PreloaderComponent from './preloader-component.vue';
import NewsDisplaySettings from './news-display-settings.vue';

const ViewComponent = defineAsyncComponent({
	// FIXME: WE SHOULD NOT USE ITEMS FROM MODULES DIRECTLY
	loader: () => import('@/modules/news/ui/view-news-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	segments,
	selectedMarketSegments,
	selectedSegmentTickers,
	selectedSegmentRequest,

	selectAll,
	unselectAll,
	toggleTicker,

	selectedScores,
	selectedSentiment,
	selectedSources,
	displaySettings,
	locations,
	activeLocations,
	selectedTickers,
	sortBy,

	resetAllChanges,
} = useNews(props.meta.widgetId);

const { data, isLoading, isError, refetch, fetchNextPage } = useQueryNews(computed<IGetNewsRequest>(() => ({
	offset: 0,
	score: selectedScores.value,
	segment: selectedSegmentRequest.value,
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
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
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
			<div :class="classes.content">
				<news-filters-panel
					v-model:selected-scores="selectedScores"
					v-model:selected-segments="selectedMarketSegments"
					v-model:selected-sentiment="selectedSentiment"
					v-model:selected-sources="selectedSources"
					v-model:locations="locations"
					v-model:sort-by="sortBy"
					:segments="segments"
					:selected-segments-tickers="selectedSegmentTickers"
					@select-all="selectAll"
					@unselect-all="unselectAll"
					@toggle-ticker="toggleTicker"
				/>
				<base-error-component v-if="isError" @retry="refetch" />
				<preloader-component v-else-if="isNotData" />
				<view-component
					v-else-if="news"
					:news="news"
					:display-settings="displaySettings"
					@next="fetchNextPage"
				/>
			</div>
		</template>
		<template #rcm>
			<news-display-settings
				v-model:display-settings="displaySettings"
				v-model:selected-scores="selectedScores"
				v-model:selected-segments="selectedMarketSegments"
				v-model:selected-sentiment="selectedSentiment"
				v-model:selected-sources="selectedSources"
				v-model:sort-by="sortBy"
				v-model:locations="locations"
				:title="props.meta.name"
				:segments="segments"
				:selected-segment-tickers="selectedSegmentTickers"
				:dashboards="props.meta.dashboards"
				@select-all="selectAll"
				@unselect-all="unselectAll"
				@toggle-ticker="toggleTicker"
				@delete="emit('delete')"
				@reset="resetAllChanges"
				@move-to="emit('moveTo', $event)"
				@duplicate="emit('duplicate')"
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

.content {
	display: flex;
	flex-direction: column;
	height: 100%;
}
</style>
