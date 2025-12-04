<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, ModalItemSwitch } from '@/modules/widgets/base';
import {
	type IGetNewsRequest,
	NewsFilters,
	type SettingKey,
	toggleSetting,
	useNews,
	useQueryNews,
} from '@/modules/news';
import { useNewsDetailsState } from '@/modules/news-details';
import { NewsFiltersPanel, NewsContentWrapper } from '@/modules/news';
import { NewsDetailsControls, NewsDetails } from '@/modules/news-details';
import { ModalBadgeList } from '@/modules/widgets/base';

import PreloaderComponent from '../common/preloader-component.vue';

interface IWidgetExposed {
	scrollBy: (px: number) => void;
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
	resetAllChanges,
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

const viewRef = ref<IWidgetExposed | null>(null);

function scrollBy(px: number) {
	if (!viewRef.value) {
		return;
	}

	viewRef.value.scrollBy(px);
}

defineExpose({ scrollBy });

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}
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
						ref="viewRef"
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
				display-variant="new"
				:segments="segments"
				:selected-segment-tickers="selectedSegmentTickers"
				@select-all="selectAll"
				@unselect-all="unselectAll"
				@toggle-ticker="toggleTicker"
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
					display-variant="new"
					:segments="segments"
					:selected-segment-tickers="selectedSegmentTickers"
					@select-all="selectAll"
					@unselect-all="unselectAll"
					@toggle-ticker="toggleTicker"
				/>
			</modal-badge-list>
		</template>
	</base-widget-dashboard>
</template>

<style scoped>

</style>
