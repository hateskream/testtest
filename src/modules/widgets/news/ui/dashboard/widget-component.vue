<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, ModalBadgeList, ModalItemSwitch } from '@/modules/widgets/base';
import {
	type IGetNewsRequest,
	NewsContentWrapper,
	NewsFilters,
	NewsFiltersPanel,
	type SettingKey,
	toggleSetting,
	useNews,
	useQueryNews,
} from '@/modules/news';
import { NewsDetails, NewsDetailsControls, useNewsDetailsState } from '@/modules/news-details';

import PreloaderComponent from '../common/preloader-component.vue';

interface IWidgetExposed {
	scrollBy: (px: number) => void;
	calcMaxCountRowVisible: (height: number) => number;
	snapHeightToNearestStep: (height: number) => number;
}

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

const {
	selectedMarkets,
	excludedTickers,
	selectedTickers,

	resetAllChanges,
	selectedMarketSegments,
	selectedSegmentsRequest,
	selectedScores,
	selectedSentiment,
	selectedSources,
	displaySettings,
	locations,
	include,
	activeDateRange,
	activeLocations,
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
	segment: selectedSegmentsRequest.value,
	sentiment: selectedSentiment.value,
	source: selectedSources.value,
	locations: activeLocations.value,
	activeSort: sortBy.value,
	limit: 50,
	dateTo: dateRange.value.to,
	dateFrom: dateRange.value.from,
})), !!props.meta.maxCountRowTable);

const { state: selectedNewsId } = useNewsDetailsState(props.meta.widgetId);

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);

const viewRef = ref<IWidgetExposed | null>(null);

function scrollBy(px: number) {
	if (!viewRef.value) {
		return;
	}

	viewRef.value.scrollBy(px);
}

function calcMaxCountRowVisible(height: number) {
	if (!viewRef.value) {
		return;
	}

	return viewRef.value.calcMaxCountRowVisible(height);
}

function snapHeightToNearestStep(height: number) {
	if (!viewRef.value) {
		return;
	}

	return viewRef.value.snapHeightToNearestStep(height);
}

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}

defineExpose({ scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@reset="resetAllChanges"
		@retry="refetch"
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
				v-model:selected-markets="selectedMarkets"
				v-model:selected-tickers="selectedTickers"
				v-model:excluded-tickers="excludedTickers"
				display-variant="dashboard"
				@reset-all-changes="resetAllChanges"
			/>
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" :display-variant="props.meta.activeDisplayVariant" />
			<news-content-wrapper v-else-if="news" :state="!!selectedNewsId">
				<template #default>
					<view-component
						ref="viewRef"
						v-model:news-id="selectedNewsId"
						:news="news"
						:display-settings="displaySettings"
						display-variant="dashboard"
						:max-count-row-tablet="props.meta.maxCountRowTable"
						@next="fetchNextPage"
					/>
				</template>

				<template #details v-if="selectedNewsId">
					<news-details-controls @back="selectedNewsId = null" />
					<news-details :uuid="selectedNewsId" display-variant="new" />
				</template>
			</news-content-wrapper>
		</template>

		<template #change-display>
			<modal-item-switch
				:model-value="displaySettings.isShowDate"
				@update:model-value="toggleDisplaySettings('isShowDate')"
			>
				Date
			</modal-item-switch>
			<modal-item-switch
				:model-value="displaySettings.isShowSource"
				@update:model-value="toggleDisplaySettings('isShowSource')"
			>
				Source
			</modal-item-switch>
			<modal-item-switch
				:model-value="displaySettings.isShowDesc"
				@update:model-value="toggleDisplaySettings('isShowDesc')"
			>
				Description
			</modal-item-switch>
			<modal-item-switch
				:model-value="displaySettings.isShowAuthor"
				@update:model-value="toggleDisplaySettings('isShowAuthor')"
			>
				Author
			</modal-item-switch>
			<modal-item-switch
				:model-value="displaySettings.isShowSymbols"
				@update:model-value="toggleDisplaySettings('isShowSymbols')"
			>
				Symbols
			</modal-item-switch>
			<modal-item-switch
				:model-value="displaySettings.isShowScore"
				@update:model-value="toggleDisplaySettings('isShowScore')"
			>
				Score
			</modal-item-switch>
		</template>

		<template #filter>
			<news-filters
				v-model:selected-scores="selectedScores"
				v-model:selected-segments="selectedMarketSegments"
				v-model:selected-sentiment="selectedSentiment"
				v-model:selected-sources="selectedSources"
				v-model:sort-by="sortBy"
				v-model:locations="locations"
				v-model:include="include"
				v-model:active-date-range="activeDateRange"
				v-model:selected-markets="selectedMarkets"
				v-model:selected-tickers="selectedTickers"
				v-model:excluded-tickers="excludedTickers"
				display-variant="new"
			/>
		</template>

		<template #nav-menu>
			<modal-badge-list display-variant="new">
				<news-filters
					v-model:selected-scores="selectedScores"
					v-model:selected-segments="selectedMarketSegments"
					v-model:selected-sentiment="selectedSentiment"
					v-model:selected-sources="selectedSources"
					v-model:sort-by="sortBy"
					v-model:locations="locations"
					v-model:include="include"
					v-model:active-date-range="activeDateRange"
					v-model:selected-markets="selectedMarkets"
					v-model:selected-tickers="selectedTickers"
					v-model:excluded-tickers="excludedTickers"
					display-variant="new"
				/>
			</modal-badge-list>
		</template>
	</base-widget-dashboard>
</template>

<style scoped>

</style>
