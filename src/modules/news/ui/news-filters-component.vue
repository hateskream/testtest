<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { UiPosition } from '@/shared/ui/position';
import {
	ModalFilterTabWrapper,
	ModalFilterTitle,
	ModalItemInteraction,
	ModalItemSelector,
} from '@/modules/widgets/base';
import {
	type ILocation,
	type ISegmentData,
	type Score,
	scoreToName,
	type SelectedSegmentTickersState,
	type Sentiment,
	sentimentToName,
	type SortState,
	sortToName,
	type Source,
	sourceToName,
	toggleFilter,
	toggleSort,
} from '../model';
import { getAllMarkets, type MarketType } from '@/modules/market';
import { NewsSegmentModal } from '@/modules/news';

import NewsLocationFilterComponent from './news-location-filter-component.vue';

const props = defineProps<{
	segments: ISegmentData[];
	selectedSegmentTickers: SelectedSegmentTickersState;
}>();

const emits = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
}>();

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });

function toggleScore(score: Score) {
	selectedScores.value = toggleFilter(selectedScores.value, score);
}

function toggleSegment(segment: MarketType) {
	selectedSegments.value = toggleFilter(selectedSegments.value, segment);
}

function toggleSentiment(sentiment: Sentiment) {
	selectedSentiment.value = toggleFilter(selectedSentiment.value, sentiment);
}

function toggleSource(source: Source) {
	selectedSources.value = toggleFilter(selectedSources.value, source);
}

function toggleSortBy(sort: SortState) {
	sortBy.value = toggleSort(sortBy.value, sort);
}
</script>

<template>
	<div :class="classes.rowWrapper">
		<div
			:class="classes.row"
		>
			<div :class="classes.rowTitle">
				Score
			</div>

			<div
				:class="classes.tabs"
			>
				<modal-filter-tab-wrapper
					v-for="(name, key) in scoreToName"
					:key="key"
					:is-active="selectedScores.has(key)"
					@click="toggleScore(key)"
				>
					{{ name }}
				</modal-filter-tab-wrapper>
			</div>
		</div>
	</div>

	<div :class="classes.rowWrapper">
		<div
			:class="classes.row"
		>
			<div :class="classes.rowTitle">
				Segment
			</div>

			<div
				:class="classes.tabs"
			>
				<modal-filter-tab-wrapper
					v-for="{type, label} in getAllMarkets()"
					:key="type"
					:is-active="selectedSegments.has(type)"
					@click="toggleSegment(type)"
				>
					{{ label }}
				</modal-filter-tab-wrapper>
			</div>
		</div>
	</div>

	<div :class="classes.rowWrapper">
		<div
			:class="classes.row"
		>
			<div :class="classes.rowTitle">
				Sentiment
			</div>

			<div
				:class="classes.tabs"
			>
				<modal-filter-tab-wrapper
					v-for="(name, key) in sentimentToName"
					:key="key"
					:is-active="selectedSentiment.has(key)"
					@click="toggleSentiment(key)"
				>
					{{ name }}
				</modal-filter-tab-wrapper>
			</div>
		</div>
	</div>

	<div :class="classes.rowWrapper">
		<div
			:class="classes.row"
		>
			<div :class="classes.rowTitle">
				Source
			</div>

			<div
				:class="classes.tabs"
			>
				<modal-filter-tab-wrapper
					v-for="(name, key) in sourceToName"
					:key="key"
					:is-active="selectedSources.has(key)"
					@click="toggleSource(key)"
				>
					{{ name }}
				</modal-filter-tab-wrapper>
			</div>
		</div>
	</div>

	<ui-position
		trigger="hover"
		:teleport="false"
	>
		<template #title>
			<modal-item-interaction> Location </modal-item-interaction>
		</template>

		<template #content>
			<news-location-filter-component v-model:locations="locations" />
		</template>
	</ui-position>

	<ui-position
		trigger="hover"
		:teleport="false"
	>
		<template #title>
			<modal-item-interaction> Ticker </modal-item-interaction>
		</template>

		<template #content>
			<news-segment-modal
				:segments="props.segments"
				:selected-segment-tickers="props.selectedSegmentTickers"
				@select-all="emits('selectAll', $event)"
				@unselect-all="emits('unselectAll', $event)"
				@toggle-ticker="(v1, v2) => emits('toggleTicker', v1, v2)"
			/>
		</template>
	</ui-position>

	<ui-driver />

	<div>
		<modal-filter-title> Sort By</modal-filter-title>

		<modal-item-selector
			v-for="(name, key) in sortToName"
			:key="key"
			:model-value="sortBy === key"
			@update:model-value="toggleSortBy(key)"
		>
			<template v-if="typeof name === 'string'">
				{{ name }}
			</template>
			<div v-else>
				{{name.value}} · <span :class="[classes.additional, sortBy === key && classes.active]">
					{{name.additional}}
				</span>
			</div>
		</modal-item-selector>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}

.additional {
	color: var(--color-text-base-300, #9a9a9d);
}

.additional.active {
	color: var(--color-text-active-base-300-active, #ffffff);
}
</style>
