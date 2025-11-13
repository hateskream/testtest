<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseWidgetTvComponent, BaseErrorComponent, ModalItemSwitch } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	NewsContentWrapper,
	NewsFilters,
	NewsFiltersPanel,
	type IGetNewsRequest,
	type SettingKey,
	useNews,
	useQueryNews,
	toggleSetting,
} from '@/modules/news';
import { NewsDetails, NewsDetailsControls, useNewsDetailsState } from '@/modules/news-details';

import PreloaderComponent from '../common/preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
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
	include,
	activeDateRange,
	dateRange,

	resetAllChanges,
	applyStateToParent,
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

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
	>
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<news-content-wrapper
				:state="!!selectedNewsId"
				:class="classes.content"
			>
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
				/>
				<base-error-component v-if="isError" @retry="refetch" />
				<preloader-component v-else-if="isNotData" />
				<view-component
					v-else-if="news"
					v-model:news-id="selectedNewsId"
					:news="news"
					:display-settings="displaySettings"
					display-variant="tv"
					@next="fetchNextPage"
				/>

				<template v-if="selectedNewsId" #details>
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
				:segments="segments"
				:selected-segment-tickers="selectedSegmentTickers"
				@select-all="selectAll"
				@unselect-all="unselectAll"
				@toggle-ticker="toggleTicker"
			/>
		</template>
	</base-widget-tv-component>
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
	height: 100%;
	overflow: hidden;
	border-bottom-right-radius: 18px;
	border-bottom-left-radius: 18px;
}
</style>
