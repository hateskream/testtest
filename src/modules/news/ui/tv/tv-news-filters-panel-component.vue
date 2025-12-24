<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeDropdown, ModalBadgeList, ModalFilter, ModalItemSelector } from '@/modules/widgets/base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketType } from '@/modules/market';
import {
	ActiveDateRange,
	type ILocation,
	Include,
	type Score,
	type Sentiment,
	type SortState,
	type Source,
	sourceToName,
	titleGenerator,
	toggleFilter,
} from '../../model';
import { type ITickerItem, SelectionMode } from '@/modules/ticker-selector';

import NewsFilters from '../news-filters-component.vue';
import TickerSelectorModalWithBadge from '@/modules/ticker-selector/new/ticker-selector-modal-with-badge.vue';

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });
const include = defineModel<Set<Include>>('include', { required: true });
const activeDateRange = defineModel<ActiveDateRange>('activeDateRange', { required: true });

const sortBy = defineModel<SortState>('sortBy', { required: true });

const locations = defineModel<ILocation[]>('locations', { required: true });


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

const selectedMarkets = defineModel<MarketType[]>('selectedMarkets', {
	required: true,
});
const selectedTickers = defineModel<ITickerItem[]>('selectedTickers', {
	required: true,
});
const excludedTickers = defineModel<ITickerItem[]>('excludedTickers', {
	required: true,
});

function onTickerSelect(tickers: ITickerItem[]) {
	selectedTickers.value = tickers;
}

function onExcludeTickers(tickers: ITickerItem[]) {
	excludedTickers.value = tickers;
}
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.listFilters">
			<div :class="classes.listFilterWithDelimiter">
				<ticker-selector-modal-with-badge
					v-model:selected-markets="selectedMarkets"
					:enabled-markets="Object.values(MarketType)"
					:selection-mode="SelectionMode.Multiple"
					display-variant="new"
					enable-select-all
					:show-icon="false"
					@update:selected-tickers="onTickerSelect"
					@update:excluded-tickers="onExcludeTickers"
				/>
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
									v-model:selected-sentiment="selectedSentiment"
									v-model:selected-sources="selectedSources"
									v-model:sort-by="sortBy"
									v-model:locations="locations"
									v-model:include="include"
									v-model:active-date-range="activeDateRange"
									v-model:selected-markets="selectedMarkets"
									v-model:selected-tickers="selectedTickers"
									v-model:excluded-tickers="excludedTickers"
									display-variant="default"
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
					<modal-badge-dropdown display-variant="default">
						<template #title>
							{{ titleSource }}
						</template>

						<template #content>
							<modal-badge-list display-variant="default">
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
					</modal-badge-dropdown>
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
