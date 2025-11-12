<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadge, ModalBadgeList, ModalFilter, ModalItemSelector } from '@/modules/widgets/base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { marketToLabel, type MarketType } from '@/modules/market';
import {
	ActiveDateRange,
	type ILocation, Include,
	type ISegmentData,
	type Score,
	type SelectedSegmentTickersState,
	type Sentiment,
	type SortState,
	type Source,
	sourceToName,
	titleGenerator,
	toggleFilter,
} from '../../model';
import { NewsMarketModal } from '@/modules/news';

import NewsFilters from '../news-filters-component.vue';

const props = defineProps<{
	segments: ISegmentData[];
	selectedSegmentsTickers: SelectedSegmentTickersState;
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
const include = defineModel<Set<Include>>('include', { required: true });
const activeDateRange = defineModel<ActiveDateRange>('activeDateRange', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });

const titleSegment = computed((): string => titleGenerator(selectedSegments.value, marketToLabel));
const titleSource = computed((): string => titleGenerator(selectedSources.value, sourceToName));

// function toggleScore(score: Score) {
// 	selectedScores.value = toggleFilter(selectedScores.value, score);
// }
//
// function toggleSentiment(sentiment: Sentiment) {
// 	selectedSentiment.value = toggleFilter(selectedSentiment.value, sentiment);
// }

function toggleSource(source: Source) {
	selectedSources.value = toggleFilter(selectedSources.value, source);
}

// function getMetricIconColor(value: string) {
// 	switch (value) {
// 		case 'high':
// 		case 'optimistic':
// 			return 'var(--metrics-color-positive-chart)';
// 		case 'neutral':
// 			return '#FFFFFF';
// 		case 'medium':
// 			return 'var(--bg-color-positive-500)';
// 		case 'pessimistic':
// 		case 'low':
// 			return 'var(--metrics-color-negative-chart)';
// 		default:
// 			return 'currentColor';
// 	}
// }
//
// function getScoreLevelActiveNumber(value: string) {
// 	switch (value) {
// 		case 'high':
// 			return 3;
// 		case 'medium':
// 			return 2;
// 		case 'low':
// 			return 1;
// 		default:
// 			return 0;
// 	}
// }
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.listFilters">
			<div :class="classes.listFilterWithDelimiter">
				<modal-badge>
					<template #title>
						{{ titleSegment || 'All' }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<news-market-modal v-model:market="selectedSegments" />
					</template>
				</modal-badge>
			</div>

			<ui-delimiter :class="classes.listFilterGroupDelimeter" />

			<div :class="classes.listFilterGroup">
				<ui-position>
					<template #title>
						<ui-icon
							:id="IconIds.NewsFilter"
							width="20"
							height="20"
							:class="classes.iconAllFilterColor"
						/>
					</template>

					<template #content>
						<modal-filter>
							<template #title>
								Filters
							</template>
							<template #content>
								<news-filters
									v-model:selected-scores="selectedScores"
									v-model:selected-segments="selectedSegments"
									v-model:selected-sentiment="selectedSentiment"
									v-model:selected-sources="selectedSources"
									v-model:sort-by="sortBy"
									v-model:locations="locations"
									v-model:include="include"
									v-model:active-date-range="activeDateRange"
									:segments="props.segments"
									:selected-segment-tickers="props.selectedSegmentsTickers"
									@select-all="emits('selectAll', $event)"
									@unselect-all="emits('unselectAll', $event)"
									@toggle-ticker="(v1, v2) => emits('toggleTicker', v1, v2)"
								/>
							</template>
						</modal-filter>
					</template>
				</ui-position>
			</div>

			<div :class="classes.optionalFilters">
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
	margin-bottom: 6px;
	padding: 0 10px 0 16px;
	gap: 6px;
	container: filters / inline-size;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.optionalFilters {
	display: contents;
}

.iconAllFilter {
	line-height: 0;
	cursor: pointer;
}

.listFilterGroup {
	display: none;
	line-height: 0;
}

.listFilterGroupDelimeter {
	display: none;
}

@container filters (max-width: 400px) {
	.optionalFilters {
		display: none;
	}

	.iconAllFilter {
		display: none;
	}

	.iconAllFilterDelimeter {
		display: none;
	}

	.listFilterGroup {
		display: block;
	}

	.listFilterGroupDelimeter {
		display: block;
	}
}

.badgeIcon {
	display: flex;
	padding: 4px;
}

.iconBorder {
	display: grid;
	width: 24px;
	height: 24px;
	line-height: 0;
	background: #19191a;
	border: 0.5px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: var(--radius-full, 9999px);
	backdrop-filter: blur(5px);
	place-items: center;

	&:not(:first-child) {
		margin-left: -8px;
	}
}

.icon {
	width: 16px;
	height: 16px;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.listFilterWithDelimiter {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
