<script setup lang="ts">
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import {
	filterValueToDisplay,
	TimeRangeFilterValue,
} from '../model';
import type { IMeta } from '@/modules/dashboard-group/core';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	meta: IMeta;
}

const selectedTicker = defineModel<string>('selectedTicker', { required: true });
const timeRange = defineModel<TimeRangeFilterValue>('timeRange', { required: true });

const props = defineProps<IViewComponentProps>();

function updateFilter(newValue: TimeRangeFilterValue) {
	timeRange.value = newValue;
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.priceHeader">
			<modal-ticker-selector-with-badge
				:model-value="[selectedTicker]"
			/>

			<div :class="classes.lineDelimiterGroup">
				<ui-delimiter />
			</div>

			<modal-badge>
				<template #title>
					{{ filterValueToDisplay[timeRange].label }}
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>
							Time Range
						</template>
						<template
							v-for="filterValue in TimeRangeFilterValue"
							:key="filterValue"
						>
							<modal-item-selector
								:model-value="filterValue === timeRange"
								@update:model-value="updateFilter(filterValue)"
							>
								{{ filterValueToDisplay[filterValue].label }}
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
