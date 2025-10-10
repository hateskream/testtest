<script setup lang="ts">
import type { MarketType } from '@/modules/market';
import { ModalItemSwitch, ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import {
	type IDisplaySettings,
	type ILocation,
	type ISegmentData,
	NewsFilters,
	Score,
	type SelectedSegmentTickersState,
	Sentiment,
	type SettingKey,
	type SortState,
	Source,
	toggleSetting,
} from '@/modules/news';

interface INewsSettingsProps {
	title: string;
	segments: ISegmentData[];
	selectedSegmentTickers: SelectedSegmentTickersState;
	dashboards: {
		id: string;
		name: string;
	}[];
}

const props = defineProps<INewsSettingsProps>();

const emit = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
	delete: [];
	reset: [];
	duplicate: [];
	moveTo: [dashboardId: string];
}>();

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const displaySettings = defineModel<IDisplaySettings>('displaySettings', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}
</script>

<template>
	<widget-context-menu
		:dashboards="props.dashboards"
		:title="props.title"
		:ui-position-props="{
			teleport: false,
			positionOffset: 12
		}"
		@delete="emit('delete')"
		@reset="emit('reset')"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
	>
		<modal-submenu :teleport="false">
			<template #title> Change display </template>

			<template #content>
				<div :class="classes.changeDisplayWrapper">
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
				</div>
			</template>
		</modal-submenu>

		<modal-submenu :teleport="false">
			<template #title> Filter & Sort </template>

			<template #content>
				<news-filters
					v-model:selected-scores="selectedScores"
					v-model:selected-segments="selectedSegments"
					v-model:selected-sentiment="selectedSentiment"
					v-model:selected-sources="selectedSources"
					v-model:sort-by="sortBy"
					v-model:locations="locations"
					:segments="props.segments"
					:selected-segment-tickers="props.selectedSegmentTickers"
					@select-all="emit('selectAll', $event)"
					@unselect-all="emit('unselectAll', $event)"
					@toggle-ticker="(v1, v2) => emit('toggleTicker', v1, v2)"
				/>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>

<style module="classes">
.changeDisplayWrapper {
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
