<script setup lang="ts">
import { computed } from 'vue';

import { UiDriver } from '@/shared/ui/driver';
import { PositionTeleport, SubpositionContent, SubpositionRoot, SubpositionTrigger } from '@/shared/ui/position';
import { UiPresence } from '@/shared/ui/presence';
import { UiTransitionFade } from '@/shared/ui/transition';
import {
	ModalItem,
	ModalFilterTitle,
	ModalItemInteraction,
	ModalFilterTabWrapper,
} from '@/modules/widgets/base';
import {
	type ActiveDateRangeType,
	type ILocation,
	type IncludeType,
	type SortState,
	type SourceType,
	includeToName,
	sourceToName,
	dateRangeStateToName,
	toggleFilter,
	Include,
	ActiveDateRange,
} from '../model';
import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';
import { getSelectedCountryNames } from '@/modules/news';
import { formatWithCount } from '@/shared/lib';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import { type ITickerItem, SelectionMode } from '@/modules/ticker-selector';
import { UiText } from '@/shared/ui/text';
import { TickerSelectorModal, ModalBadgePreview } from '@/modules/ticker-selector';

import NewsLocationFilterComponent from './news-location-filter-component.vue';
import SortbyModalInner from '@/modules/news/ui/modal/sortby-modal-inner.vue';

const props = defineProps<{
	displayVariant: 'new' | 'default';
}>();

const selectedMarkets = defineModel<MarketType[]>('selectedMarkets', {
	required: true,
});
const selectedTickers = defineModel<ITickerItem[]>('selectedTickers', {
	required: true,
});
const excludedTickers = defineModel<ITickerItem[]>('excludedTickers', {
	required: true,
});

// const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
// const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
// const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<SourceType>>('selectedSources', { required: true });
const sortBy = defineModel<SortState>('sortBy', { required: true });
const locations = defineModel<ILocation[]>('locations', { required: true });
const include = defineModel<Set<IncludeType>>('include', { required: true });
const activeDateRange = defineModel<ActiveDateRangeType>('activeDateRange', { required: true });

const locationLabel = computed(() => {
	const names = getSelectedCountryNames(locations.value);

	const totalCountries = locations.value.reduce(
		(acc, loc) => acc + loc.countries.length,
		0,
	);

	if (names.length === totalCountries) {
		return 'All';
	}

	return formatWithCount(names, {
		default: '',
		separator: ', ',
		prefix: '+',
	}).toString();
});

function toggleSource(source: SourceType) {
	selectedSources.value = toggleFilter(selectedSources.value, source);
}

function toggleInclude(value: IncludeType) {
	include.value = toggleFilter(include.value, value);
}

function onTickerSelect(tickers: ITickerItem[]) {
	selectedTickers.value = tickers;
}

function onExcludeTickers(tickers: ITickerItem[]) {
	excludedTickers.value = tickers;
}
</script>

<template>
	<div :class="classes.container">
		<subposition-root trigger="hover" v-slot="{isOpen}">
			<subposition-trigger>
				<modal-item-interaction>
					<span style="display: flex;">
						<ui-text token="text-300-r">Tickers ·&nbsp;</ui-text>
						<modal-badge-preview
							font-token="text-300-r"
							:selected-tickers="selectedTickers"
							:selected-markets="selectedMarkets"
							:excluded-tickers="excludedTickers"
							:selected-market-tickers="[]"
							:display-variant="props.displayVariant"
							:show-icon="false"
							show-label
						/>
					</span>
				</modal-item-interaction>
			</subposition-trigger>
			<position-teleport>
				<ui-presence :state="isOpen" v-slot="{present}">
					<ui-transition-fade>
						<subposition-content v-if="present" placement="right-start">
							<ticker-selector-modal
								v-model:selected-markets="selectedMarkets"
								:enabled-markets="ALL_MARKET_TYPES"
								:selection-mode="SelectionMode.Multiple"
								:display-variant="props.displayVariant"
								enable-select-all
								@update:selected-tickers="onTickerSelect"
								@update:excluded-tickers="onExcludeTickers"
							/>
						</subposition-content>
					</ui-transition-fade>
				</ui-presence>
			</position-teleport>
		</subposition-root>

		<subposition-root trigger="hover" v-slot="{isOpen}">
			<subposition-trigger>
				<modal-item-interaction>
					<span>Location
						<span v-if="locationLabel" :class="classes.additional">· {{locationLabel}}</span>
					</span>
				</modal-item-interaction>
			</subposition-trigger>
			<position-teleport>
				<ui-presence :state="isOpen" v-slot="{present}">
					<ui-transition-fade>
						<subposition-content v-if="present" placement="right-start">
							<news-location-filter-component
								v-model:locations="locations"
								:display-variant
							/>
						</subposition-content>
					</ui-transition-fade>
				</ui-presence>
			</position-teleport>
		</subposition-root>

		<modal-item :class="classes.select">
			<div :class="classes.rowTitle">Include</div>
			<div :class="classes.tips">
				<modal-filter-tab-wrapper
					v-for="namedInclude in Include"
					:key="namedInclude"
					:is-active="include.has(namedInclude)"
					@click="toggleInclude(namedInclude)"
				>
					{{includeToName[namedInclude]}}
				</modal-filter-tab-wrapper>
			</div>
		</modal-item>

		<modal-item :class="classes.select">
			<div :class="classes.rowTitle">Source</div>
			<div :class="classes.tips">
				<modal-filter-tab-wrapper
					v-for="[source, label] in Object.entries(sourceToName)"
					:key="source"
					:is-active="selectedSources.has(source as SourceType)"
					@click="toggleSource(source as SourceType)"
				>
					{{label}}
				</modal-filter-tab-wrapper>
			</div>
		</modal-item>

		<modal-item :class="classes.select">
			<div :class="classes.rowTitle">Date range</div>
			<ui-segmented-control v-model="activeDateRange">
				<ui-segmented-control-item
					v-for="date in ActiveDateRange"
					:key="date"
					:value="date"
				>
					{{dateRangeStateToName[date]}}
				</ui-segmented-control-item>
			</ui-segmented-control>
		</modal-item>

		<ui-driver />

		<div>
			<modal-filter-title>Sort By</modal-filter-title>

			<sortby-modal-inner v-model="sortBy" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	width: 389px;
}

.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
}

.rowTitle {
	padding: 10px 18px 10px 0;
}

.rowTitle::first-letter {
	text-transform: uppercase;
}

.select {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.select:hover {
	background-color: unset !important;
	cursor: unset;
}

.tips {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	margin-left: auto;
	padding: 4px 0;
	gap: 8px;
}


</style>
