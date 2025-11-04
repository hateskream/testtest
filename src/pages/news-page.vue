<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LayoutComponent } from '@/modules/layout';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	type IGetNewsRequest,
	NewsContentWrapper,
	NewsFiltersPanel,
	NewsListComponent,
	useNews,
	useQueryNews,
} from '@/modules/news';
import { NewsDetails, useNewsDetailsState } from '@/modules/news-details';
import { BaseErrorComponent } from '@/modules/widgets/base';

import PreloaderComponent from '@/modules/widgets/exchanges/ui/preloader-component.vue';

const { state: selectedNewsId } = useNewsDetailsState('news-page');

const route = useRoute();
const router = useRouter();

watch(() => route.query.details, (value) => {
	if (value === selectedNewsId.value || typeof value !== 'string') {
		return;
	}

	selectedNewsId.value = value;
}, { immediate: true });

watch(selectedNewsId, (value) => {
	const query = { ...route.query };

	if (value) {
		query.details = value;
	} else {
		delete query.details;
	}

	router.replace({ query });
});

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
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">
				<button :class="classes.button">
					<ui-icon
						:id="IconIds.Arrow"
						width="12px"
						height="12px"
					/>
					News
				</button>
			</div>
		</template>
		<template #content>
			<news-content-wrapper :news-id="selectedNewsId">
				<template #default>
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

					<preloader-component v-else-if="isLoading" />

					<news-list-component
						v-else-if="news"
						v-model:news-id="selectedNewsId"
						:news="news"
						:display-settings="displaySettings"
						@next="fetchNextPage"
						@select-news="selectedNewsId = $event"
					/>
				</template>

				<template v-if="selectedNewsId" #details>
					<news-details
						:uuid="selectedNewsId"
						@back="selectedNewsId = null"
					/>
				</template>
			</news-content-wrapper>
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	padding: 0 8px;
	font-style: normal;
	font-weight: 410;
	font-size: var(--typography-headers-size-h01, 20px);
	line-height: 1;
}

.header .button {
	height: 100%;
	padding: 8px 0;
	color: #ffffff;
	cursor: pointer;
}
</style>
