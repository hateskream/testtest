<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import {
	ModalBadgeList,
	ModalBadge,
	ModalItemSelector,
} from '../../base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { marketToLabel, type MarketType } from '@/modules/market';
import {
	type Score,
	type Sentiment,
	type Source,
	type SortState,
	toggleFilter,
	scoreToName,
	titleGenerator,
	sentimentToName,
	sourceToName,
	type ILocation,
} from '../model';

import NewsFilters from './news-filters-component.vue';

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });

const titleScore = computed((): string => titleGenerator(selectedScores.value, scoreToName));
const titleSegment = computed((): string => titleGenerator(selectedSegments.value, marketToLabel));
const titleSentiment = computed((): string => titleGenerator(selectedSentiment.value, sentimentToName));
const titleSource = computed((): string => titleGenerator(selectedSources.value, sourceToName));

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
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.iconAllFilter">
			<ui-position>
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.iconAllFilterColor"
					/>
				</template>

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
			</ui-position>
		</div>

		<ui-delimiter />

		<div :class="classes.listFilters">
			<!-- <div
				v-if="newsStore.activeTickersList.length > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						<div :class="classes.listFiltersTitleImageWrapper">
							<div
								v-for="item in newsStore.activeTickersList.slice(
									0,
									ACTIVE_TICKER_LIST_COUNT_SHOW,
								)"
								:key="item.ticker"
								:class="classes.listFiltersTitleImage"
							>
								<ui-image
									:src="item.image"
									replacement="/images/market/ADA.png"
								/>
							</div>
						</div>

						<div
							v-if="
								newsStore.activeTickersList.length - ACTIVE_TICKER_LIST_COUNT_SHOW >
									0
							"
						>
							+{{
								newsStore.activeTickersList.length - ACTIVE_TICKER_LIST_COUNT_SHOW
							}}
						</div>

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-filter-ticker
							:model-value="newsStore.tickerLists"
							@update:model-value="newsStore.setTickerLists"
						/>
					</template>
				</modal-badge>
				<ui-delimiter />
			</div> -->
			<ui-delimiter v-if="selectedScores.size > 0" />
			<div
				v-if="selectedScores.size > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						{{ titleScore }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Score
							</template>

							<template
								v-for="(name, key) in scoreToName"
								:key="key"
							>
								<modal-item-selector
									:model-value="selectedScores.has(key)"
									@update:model-value="toggleScore(key)"
								>
									{{ name }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>

			</div>

			<ui-delimiter v-if="selectedSegments.size > 0" />
			<div
				v-if="selectedSegments.size > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						{{ titleSegment }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Segment
							</template>

							<template
								v-for="(name, key) in marketToLabel"
								:key="key"
							>
								<modal-item-selector
									:model-value="selectedSegments.has(key)"
									@update:model-value="toggleSegment(key)"
								>
									{{ name }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>

			</div>

			<ui-delimiter v-if="selectedSentiment.size > 0" />
			<div
				v-if="selectedSentiment.size > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						{{ titleSentiment }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Sentiment
							</template>

							<template
								v-for="(name, key) in sentimentToName"
								:key="key"
							>
								<modal-item-selector
									:model-value="selectedSentiment.has(key)"
									@update:model-value="toggleSentiment(key)"
								>
									{{ name }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>
			</div>

			<ui-delimiter v-if="selectedSources.size > 0" />
			<div
				v-if="selectedSources.size > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						{{ titleSource }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								Source
							</template>

							<template
								v-for="(name, key) in sourceToName"
								:key="key"
							>
								<modal-item-selector
									:model-value="selectedSources.has(key)"
									@update:model-value="toggleSource(key)"
								>
									{{ name }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.listFiltersTitleImageWrapper {
	display: flex;
}

.listFiltersTitleImage {
	width: 28px;
	height: 28px;
	margin-left: -12px;
	overflow: hidden;
	background-color: #222223;
	border: 2px solid #222223;
	border-radius: 100%;
}

.listFiltersTitleImageWrapper > .listFiltersTitleImage:first-child {
	margin-left: 0;
}

.container {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 0 10px 0 16px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	height: 42px;
	padding-bottom: 4px;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}

.listFilterWithDelimiter {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
