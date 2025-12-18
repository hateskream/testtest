<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { AppLayout } from '@/modules/layout';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	type IGetNewsRequest,
	NewsContentWrapper,
	NewsFiltersPanel,
	NewsListComponent,
	useNews,
	useNewsPage,
	useQueryNews,
} from '@/modules/news';
import { NewsDetails, NewsDetailsControls } from '@/modules/news-details';
import { BaseErrorComponent } from '@/modules/widgets/base';
import { RoutePaths } from '@/types/route.d';

import PreloaderComponent from '@/modules/widgets/exchanges/ui/preloader-component.vue';

const route = useRoute();
const router = useRouter();

const isOpen = ref(true);

const {
	segments,
	selectedMarketSegments,
	selectedSegmentTickers,
	selectedSegmentRequest,

	resetAllChanges,
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
	include,
	activeDateRange,
	dateRange,
} = useNews({
	widgetId: 'news-page',
	isEphemeral: false,
	defaultStateType: '',
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

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);

const uuid = computed(
	() => String(route?.params?.id ?? news.value?.[0]?.id ?? '') || null,
);
const redirectedFrom = computed(
	() => String(route?.query?.redirectedFrom ?? '') || null,
);

function goBack() {
	if (!redirectedFrom.value) {
		router.push(RoutePaths.Home);
		return;
	}

	router.push(redirectedFrom.value);
}

const { redirect } = useNewsPage();
</script>

<template>
	<app-layout>
		<div :class="classes.container">
			<div :class="classes.header">
				<button :class="classes.button" @click="goBack">
					<ui-icon
						:id="IconIds.Arrow"
						width="12px"
						height="12px"
					/>
					News
				</button>
			</div>
			<news-content-wrapper :state="isOpen">
				<template #default>
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
						display-variant="tv"
						@select-all="selectAll"
						@unselect-all="unselectAll"
						@toggle-ticker="toggleTicker"
						@reset-all-changes="resetAllChanges"
					/>

					<base-error-component v-if="isError" @retry="refetch" />

					<preloader-component v-else-if="isLoading" />

					<news-list-component
						v-else-if="news"
						v-model:news-id="uuid"
						:news="news"
						:display-settings="displaySettings"
						display-variant="tv"
						@next="fetchNextPage"
						@select-news="redirect($event.id, $event.slug)"
					/>
				</template>

				<template #controls>
					<news-details-controls
						:class="classes.controls"
						@click="isOpen = false"
					/>
				</template>

				<template #details v-if="uuid">
					<news-details :uuid="uuid" display-variant="new" />
				</template>
			</news-content-wrapper>
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	padding: 20px;
}

.header {
	padding: 0 8px;
	font-style: normal;
	font-weight: 410;
	font-size: var(--font-title-300-size, 20px);
	line-height: 1;
}

.header .button {
	height: 100%;
	padding: 8px 0;
	color: #ffffff;
	cursor: pointer;
}
</style>
