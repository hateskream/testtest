<script setup lang="ts">
import { computed } from 'vue';

import { UiDriver } from '@/shared/ui/driver';
import { SubpositionContent, SubpositionRoot, SubpositionTrigger } from '@/shared/ui/position';
import { UiPresence } from '@/shared/ui/presence';
import { UiTransitionFade } from '@/shared/ui/transition';
import {
	ModalItem,
	ModalFilterTitle,
	ModalItemInteraction,
	ModalItemSelector,
	ModalFilterTabWrapper,
} from '@/modules/widgets/base';
import {
	type ILocation,
	type ISegmentData,
	type SelectedSegmentTickersState,
	type SortState,
	type Source,
	sortToName,
	sourceToName,
	toggleFilter,
	toggleSort, Include, includeToName, ActiveDateRange, dateRangeStateToName,
} from '../model';
import { type MarketType } from '@/modules/market';
import { getSegmentsTitleStr, getSelectedCountryNames, NewsSegmentModal } from '@/modules/news';
import { formatWithCount } from '@/shared/lib';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';

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

// const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
// const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
// const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });
const sortBy = defineModel<SortState>('sortBy', { required: true });
const locations = defineModel<ILocation[]>('locations', { required: true });
const include = defineModel<Set<Include>>('include', { required: true });
const activeDateRange = defineModel<ActiveDateRange>('activeDateRange', { required: true });

const tickersLabel = computed(() => {
	return getSegmentsTitleStr(props.segments, props.selectedSegmentTickers, 1);
});

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

function toggleSource(source: Source) {
	selectedSources.value = toggleFilter(selectedSources.value, source);
}

function toggleSortBy(sort: SortState) {
	sortBy.value = toggleSort(sortBy.value, sort);
}

function toggleInclude(value: Include) {
	include.value = toggleFilter(include.value, value);
}
</script>

<template>
	<div :class="classes.container">
		<subposition-root trigger="hover" v-slot="{isOpen}">
			<subposition-trigger>
				<modal-item-interaction>
					<span>Tickers
						<span v-if="tickersLabel" :class="classes.additional">· {{tickersLabel}}</span>
					</span>
				</modal-item-interaction>
			</subposition-trigger>
			<ui-presence :state="isOpen" v-slot="{present}">
				<ui-transition-fade>
					<subposition-content v-if="present">
						<news-segment-modal
							:segments="props.segments"
							:selected-segment-tickers="props.selectedSegmentTickers"
							@select-all="emits('selectAll', $event)"
							@unselect-all="emits('unselectAll', $event)"
							@toggle-ticker="(v1, v2) => emits('toggleTicker', v1, v2)"
						/>
					</subposition-content>
				</ui-transition-fade>
			</ui-presence>
		</subposition-root>

		<subposition-root trigger="hover" v-slot="{isOpen}">
			<subposition-trigger>
				<modal-item-interaction>
					<span>Location
						<span v-if="locationLabel" :class="classes.additional">· {{locationLabel}}</span>
					</span>
				</modal-item-interaction>
			</subposition-trigger>
			<ui-presence :state="isOpen" v-slot="{present}">
				<ui-transition-fade>
					<subposition-content v-if="present">
						<news-location-filter-component v-model:locations="locations" />
					</subposition-content>
				</ui-transition-fade>
			</ui-presence>
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
					:is-active="selectedSources.has(source as Source)"
					@click="toggleSource(source as Source)"
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

.additional {
	color: var(--color-text-base-300, #9a9a9d);
}

.additional.active {
	color: var(--color-text-active-base-300-active, #ffffff);
}
</style>
