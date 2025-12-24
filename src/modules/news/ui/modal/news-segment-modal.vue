<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useDebounce } from '@vueuse/core';

import { ModalItemCheckbox } from '@/modules/widgets/base';
import { UiPillItem, UiPillWrapper } from '@/shared/ui/pill';
import { UiAccordion } from '@/shared/ui/accordion';
import { MarketType } from '@/modules/market';
import { type ISegmentData, SegmentFilterIds, segmentFilters } from '@/modules/news/model';
import { hasInSegment, isAllSelectedInSegment, parseTicker, type SelectedSegmentTickersState } from '@/modules/news';
import { UiModalContent, UiModalSearch, UiModalWrapper } from '@/shared/ui/modal';

import ModalFilterEmptyState from '@/modules/ticker-selector/ui/components/modal/modal-filter-empty-state.vue';

const props = defineProps<{
	displayVariant: 'default' | 'new';
	segments: ISegmentData[];
	selectedSegmentTickers: SelectedSegmentTickersState;
}>();

const emits = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
}>();

const model = defineModel<SegmentFilterIds>('filter', {
	default: SegmentFilterIds.All,
});

const search = ref('');
const searchDebounced = useDebounce(search, 300);

const isSearching = computed(() => {
	return search.value.length > 0;
});

const filteredSegments = computed(() => {
	const query = searchDebounced.value.trim().toLowerCase();
	const isSelectedMode = model.value === SegmentFilterIds.Selected;

	return props.segments
		.map(segment => {
			const selected = props.selectedSegmentTickers[segment.id] ?? new Set<string>();

			let tickers = isSelectedMode
				? segment.tickers.filter(t => selected.has(parseTicker(segment.id, t)))
				: segment.tickers;

			if (query) {
				tickers = tickers.filter(t =>
					`${t.left} ${t.right}`.toLowerCase().includes(query),
				);
			}

			const allIds = segment.tickers.map(t =>
				segment.id === MarketType.Forex ? `${t.left}+${t.right}` : t.left,
			);
			const isAllSelected = model.value === SegmentFilterIds.Selected || selected.size === allIds.length;
			const toggleLabel = isAllSelected ? 'Unselect all' : 'Select all';

			return {
				...segment,
				tickers,
				isAllSelected,
				toggleLabel,
			};
		});
});

function getTickersCount(filterId: SegmentFilterIds, segments: ISegmentData[]): number {
	if (filterId === SegmentFilterIds.All) {
		return segments.reduce((sum, s) => sum + s.tickers.length, 0);
	}

	return Object.entries(props.selectedSegmentTickers).reduce((sum, [segmentId, set]) => {
		const segExists = segments.some(s => s.id === segmentId);

		return segExists ? sum + (set?.size ?? 0) : sum;
	}, 0);
}

function toggleSegment(segmentId: MarketType, segments: ISegmentData[]): void {
	const isAllMode = model.value === SegmentFilterIds.All;
	const isSelected = isAllSelectedInSegment(
		segmentId,
		segments,
		props.selectedSegmentTickers,
	);

	if (isAllMode) {
		isSelected ? emits('unselectAll', segmentId) : emits('selectAll', segmentId);
	} else {
		emits('unselectAll', segmentId);
	}
}

const searchRef = useTemplateRef('searchDOM');

function onContainerClick() {
	searchRef.value?.searchFocus();
}
</script>

<template>
	<ui-modal-wrapper
		:class="classes.root"
		:display-variant="displayVariant"
		@click="onContainerClick"
	>
		<ui-modal-search
			ref="searchDOM"
			v-model="search"
			autofocus
		/>

		<ui-pill-wrapper>
			<ui-pill-item
				v-for="filter in segmentFilters"
				:key="filter.id"
				:model-value="filter.id === model"
				@click="model = filter.id"
			>
				{{filter.label}} · {{getTickersCount(filter.id, props.segments)}}
			</ui-pill-item>
		</ui-pill-wrapper>

		<ui-modal-content>
			<ui-accordion
				v-for="segment in filteredSegments"
				:key="segment.label"
				:model-value="isSearching ?? undefined"
				:class="classes.accordion"
			>
				<template #left>
					{{ segment.label }}
				</template>
				<template #right>
					<button
						class="text-200-r"
						:class="classes.selectUnSelectAll"
						@click.stop="toggleSegment(segment.id, filteredSegments)"
					>
						{{ segment.toggleLabel }}
					</button>
				</template>
				<template #content v-if="segment.tickers.length > 0">
					<modal-item-checkbox
						v-for="ticker in segment.tickers"
						:key="`${ticker.left}+${ticker.right}`"
						:model-value="hasInSegment(segment.id, ticker, props.selectedSegmentTickers)"
						@click="emits('toggleTicker', segment.id, parseTicker(segment.id, ticker))"
					>
						{{ ticker.left }} · {{ ticker.right }}
					</modal-item-checkbox>
				</template>

				<template #content v-else>
					<modal-filter-empty-state>
						Nothing found in {{ segment.label }}
					</modal-filter-empty-state>
				</template>
			</ui-accordion>
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">
.root {
	min-width: 312px;
	scrollbar-width: none;
}

.search {
	box-sizing: border-box;
	padding: 4px 8px;
}

.controls {
	display: flex;
	align-items: center;
	height: 42px;
	gap: 6px;
	padding: 4px 8px;
}

.section {
	display: flex;
	flex-direction: column;
	max-height: 450px;
	margin: 0 -6px;
	padding: 0 6px;
	overflow-y: auto;
	scrollbar-gutter: stable;
}

.accordion:hover .selectUnSelectAll {
	display: block;
}

.selectUnSelectAll {
	display: none;
	line-height: 1;
	text-align: right;
	color: var(--color-text-base-300, #9a9a9d);
	cursor: pointer;

	&:hover {
		color: #ffffff;
		text-decoration: underline;
	}
}
</style>
