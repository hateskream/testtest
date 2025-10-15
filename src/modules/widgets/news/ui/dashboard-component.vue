<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	type IGetNewsRequest,
	NewsFilters,
	NewsFiltersPanel,
	type SettingKey,
	toggleSetting,
	useNews,
	useQueryNews,
} from '@/modules/news';
import { ModalItemSwitch } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';


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
} = useNews(props.meta.widgetId, props.meta.defaultStateType);

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

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}
</script>

<template>
	<base-dashboard-component
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
				:segments="segments"
				:selected-segment-tickers="selectedSegmentTickers"
				@select-all="selectAll"
				@unselect-all="unselectAll"
				@toggle-ticker="toggleTicker"
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
