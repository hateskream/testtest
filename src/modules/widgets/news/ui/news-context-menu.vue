<script setup lang="ts">
import type { MarketType } from '@/modules/market';
import {
	ModalItemSwitch,
	WidgetContextMenu,
	ModalSubmenu,
} from '../../base';
import {
	Score,
	Sentiment,
	Source,
	toggleSetting,
	type IDisplaySettings,
	type ILocation,
	type SettingKey,
	type SortState,
} from '../model';

import NewsFilters from './news-filters-component.vue';

interface INewsContextMenuProps {
	title: string;
}

const props = defineProps<INewsContextMenuProps>();

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const displaySettings = defineModel<IDisplaySettings>('displaySettings', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
}>();

function toggleDisplaySettings(settingsKey: SettingKey) {
	displaySettings.value = toggleSetting(displaySettings.value, settingsKey);
}
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>
		<modal-submenu>
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
						:model-value="displaySettings.isShowSentiment"
						@update:model-value="toggleDisplaySettings('isShowSentiment')"
					>
						Sentiment
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

		<modal-submenu>
			<template #title> Filter & Sort </template>

			<template #content>
				<news-filters
					v-model:selected-scores="selectedScores"
					v-model:selected-segments="selectedSegments"
					v-model:selected-sentiment="selectedSentiment"
					v-model:selected-sources="selectedSources"
					v-model:sort-by="sortBy"
					v-model:locations="locations"
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
