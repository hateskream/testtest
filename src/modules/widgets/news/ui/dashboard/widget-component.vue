<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { type IGetNewsRequest, useNews, useQueryNews } from '@/modules/news';
import { useNewsDetailsState } from '@/modules/news-details';
import { NewsFiltersPanel, NewsContentWrapper } from '@/modules/news';
import { NewsDetailsControls, NewsDetails } from '@/modules/news-details';

import PreloaderComponent from '../common/preloader-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

const {
	selectAll,
	unselectAll,
	toggleTicker,
	segments,
	selectedMarketSegments,
	selectedSegmentTickers,
	selectedSegmentRequest,
	selectedScores,
	selectedSentiment,
	selectedSources,
	displaySettings,
	locations,
	include,
	activeDateRange,
	activeLocations,
	selectedTickers,
	sortBy,
	dateRange,
} = useNews({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

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

const { state: selectedNewsId } = useNewsDetailsState(props.meta.widgetId);

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<news-filters-panel
				v-model:selected-scores="selectedScores"
				v-model:selected-segments="selectedMarketSegments"
				v-model:selected-sentiment="selectedSentiment"
				v-model:selected-sources="selectedSources"
				v-model:locations="locations"
				v-model:sort-by="sortBy"
				v-model:include="include"
				v-model:active-date-range="activeDateRange"
				v-model:date-range="dateRange"
				:segments="segments"
				:selected-segments-tickers="selectedSegmentTickers"
				display-variant="dashboard"
				@select-all="selectAll"
				@unselect-all="unselectAll"
				@toggle-ticker="toggleTicker"
			/>
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" />
			<news-content-wrapper v-else-if="news" :state="!!selectedNewsId">
				<template #default>
					<view-component
						v-model:news-id="selectedNewsId"
						:news="news"
						:display-settings="displaySettings"
						display-variant="dashboard"
						@next="fetchNextPage"
					/>
				</template>

				<template #details v-if="selectedNewsId">
					<news-details-controls @back="selectedNewsId = null" />
					<news-details :uuid="selectedNewsId" />
				</template>
			</news-content-wrapper>
		</template>
	</base-widget-dashboard>
</template>

<style scoped>

</style>
