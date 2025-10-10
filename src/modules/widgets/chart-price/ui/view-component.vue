<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	MarketBadge,
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import {
	filterTypeToName,
	filterValueToDisplay,
	type FiltersState,
	type FiltersValues,
	type FilterType,
	type IDisplaySettings,
	type ITicker,
} from '../model';
import type { IMeta } from '@/modules/dashboard-group/core';
import type { MarketType } from '@/modules/market';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	tickers: ITicker[];
	settings: IDisplaySettings;
	meta: IMeta;
	filtersValues: FiltersValues;
}

const activeMarket = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

const props = defineProps<IViewComponentProps>();

const emit = defineEmits<{
	(e: 'togglePin', tickerId: string): void;
}>();

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(props.settings.isShowChart && props.meta.size.w > 1)) +
		+props.settings.isShowPercentageChange +
		(+(props.settings.isShowLogo && props.meta.size.w > 1)) +
		+props.settings.isShowTicker +
		+props.settings.isShowDescription
	) * 30);


	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});

function updateFilter(filterKey: FilterType, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: filterValue,
	};
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.priceHeader">
			<market-badge v-model="activeMarket" />

			<div :class="classes.lineDelimiterGroup">
				<ui-delimiter />
			</div>
			<modal-badge
				v-for="(filterState, filterKey) in filters"
				:key="filterKey"
				:class="classes.filter"
			>
				<template #title v-if="filterState">
					{{ filterValueToDisplay[filterState].label }}
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>
							{{ filterTypeToName[filterKey] }}
						</template>
						<template
							v-for="filterValue in props.filtersValues[filterKey]"
							:key="filterValue.value"
						>

							<modal-item-selector
								:model-value="filterValue.value === filterState"
								@update:model-value="updateFilter(filterKey, filterValue.value)"
							>
								{{ filterValue.label }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

		</div>

		<div :class="classes.scrollable">
			<div :class="classes.content">
				<chart-price
					:meta="meta"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.filter {
	margin-left: 6px;
}

.priceHeader {
	margin-inline: 12px;
	display: flex;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.flip-list-move {
	transition: transform 0.5s;
}

.content {
	width: 100%;
	height: 100%;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}

.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: 6px;
}

.sectionEnterActive,
.sectionLeaveActive {
	max-height: 700px;
	opacity: 1;
	transition: all 0.4s ease;
}

.sectionEnterFrom,
.sectionLeaveTo {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>

<style scoped>
:deep(.vgl-item--placeholder) {
	background: transparent !important;
}
</style>
