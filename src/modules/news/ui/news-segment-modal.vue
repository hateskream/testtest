<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useDebounce } from '@vueuse/core';

import { ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';
import { UiSearch } from '@/shared/ui/input';
import { UiDriver } from '@/shared/ui/driver';
import { UiPillButton } from '@/shared/ui/pill';
import { UiAccordion } from '@/shared/ui/accordion';
import { MarketType } from '@/modules/market';
import { type ISegmentData, SegmentFilterIds, segmentFilters } from '@/modules/news/model';
import { hasInSegment, isAllSelectedInSegment, parseTicker, type SelectedSegmentTickersState } from '@/modules/news';

const props = defineProps<{
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
		})
		.filter(s => s.tickers.length > 0);
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

const searchRef = useTemplateRef('searchEl');

onMounted(() => {
	searchRef.value?.focus?.();
});
</script>

<template>
	<modal-badge-list :class="classes.root">
		<ui-search
			ref="searchEl"
			v-model="search"
			:class="classes.search"
			placeholder="Start typing the ticker..."
		/>
		<ui-driver />
		<div :class="classes.controls">
			<ui-pill-button
				v-for="filter in segmentFilters"
				:key="filter.id"
				:model-value="filter.id === model"
				@click="model = filter.id"
			>
				{{filter.label}} · {{getTickersCount(filter.id, props.segments)}}
			</ui-pill-button>
		</div>

		<div :class="classes.section">
			<ui-accordion
				v-for="segment in filteredSegments"
				:key="segment.label"
				:class="classes.accordion"
			>
				<template #left>
					{{ segment.label }}
				</template>
				<template #right>
					<button
						:class="classes.selectUnSelectAll"
						@click.stop="toggleSegment(segment.id, filteredSegments)"
					>
						{{ segment.toggleLabel }}
					</button>
				</template>
				<template #content>
					<modal-item-checkbox
						v-for="ticker in segment.tickers"
						:key="`${ticker.left}+${ticker.right}`"
						:model-value="hasInSegment(segment.id, ticker, props.selectedSegmentTickers)"
						@click="emits('toggleTicker', segment.id, parseTicker(segment.id, ticker))"
					>
						{{ ticker.left }} · {{ ticker.right }}
					</modal-item-checkbox>
				</template>
			</ui-accordion>
		</div>
	</modal-badge-list>
</template>

<style module="classes">
.root {
	min-width: 250px;
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
}

.accordion:hover .selectUnSelectAll {
	display: block;
}

.selectUnSelectAll {
	display: none;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 15px);
	line-height: 1;
	font-family: 'Roboto Flex', sans-serif;
	text-align: right;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	cursor: pointer;

	&:hover {
		color: #ffffff;
		text-decoration: underline;
	}
}
</style>
