<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import type { IDominanceSnapshot } from '../../../model';
import type { IMeta } from '@/modules/dashboard-group';
import { UiScrollFade } from '@/shared/ui/scroll-fade';
import { useHoverWheelScroll } from '@/shared/composables';
import { UiClamped } from '@/shared/ui/clamped';

import DominanceHistoricalGridCell from './dominance-historical-grid-cell.vue';

interface IHistoricalRowProps {
	snapshots: IDominanceSnapshot[];
	isShowToday?: boolean;
	meta: IMeta;
}

const props = defineProps<IHistoricalRowProps>();

const cols = computed(() => props.isShowToday ? 5 : 4);

const labels = computed(() => {
	if (props.meta.size.w < 3) {
		return ['Today', 'Yesterday', 'L. week', 'L. month'];
	}

	return ['Today', 'Yesterday', 'Last week', 'Last month'];
});

const filteredLabels = computed(() => {
	if (props.isShowToday) {
		return labels.value;
	}

	return labels.value.slice(1);
});

const scrollableRef = useTemplateRef('scrollable');

const wheelTarget = computed(() => {
	const scrollable = scrollableRef.value;
	if (scrollable) {
		return scrollable.$el;
	}

	return null;
});

const { wheelIsActive } = useHoverWheelScroll(wheelTarget);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.grid">
			<dominance-historical-grid-cell></dominance-historical-grid-cell>
			<dominance-historical-grid-cell v-for="label in filteredLabels" :key="label">
				{{label}}
			</dominance-historical-grid-cell>
		</div>
		<ui-scroll-fade ref="scrollable" :class="[classes.scrollable, { [classes.wheel]: wheelIsActive }]">
			<div :class="[classes.grid, classes.tickers]">
				<template v-for="item in props.snapshots" :key="item.id">
					<dominance-historical-grid-cell :class="[classes.name, classes.cell]">
						<div :class="classes.dot" :style="{ backgroundColor: item.color }"></div>
						<ui-clamped :rows="1">
							{{ item.symbol }}
						</ui-clamped>
					</dominance-historical-grid-cell>
					<dominance-historical-grid-cell v-if="isShowToday" :class="classes.cell">
						{{ item.dominance.current.toFixed(1) }}%
					</dominance-historical-grid-cell>
					<dominance-historical-grid-cell :class="classes.cell">
						{{ item.dominance.yesterday.toFixed(1) }}%
					</dominance-historical-grid-cell>
					<dominance-historical-grid-cell :class="classes.cell">
						{{ item.dominance.week.toFixed(1) }}%
					</dominance-historical-grid-cell>
					<dominance-historical-grid-cell :class="[classes.cell, classes.last]">
						{{ item.dominance.year.toFixed(1) }}%
					</dominance-historical-grid-cell>
				</template>
			</div>
		</ui-scroll-fade>
	</div>
</template>

<style module="classes">
.scrollable.wheel {
	box-sizing: border-box;
	margin-right: -3px;
	padding-right: 3px;
}

.scrollable.wheel::-webkit-scrollbar-thumb {
	background-color: var(--scrollbar-color);
}

.root {
	display: flex;
	flex-direction: column;
}

.grid {
	display: grid;
	grid-template-columns: repeat(v-bind(cols), minmax(0, 1fr));
	grid-auto-rows: 17px;
	gap: 1px;
}

.cell {
	background-color: var(--bg-color-surface-03);
}

.tickers {
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.name {
	gap: 6px;
	justify-content: flex-start;
	border-radius: var(--radius-full, 9999px) 0 0 var(--radius-full, 9999px);
}

.last {
	border-radius: 0 var(--radius-full, 9999px) var(--radius-full, 9999px) 0;
}

.dot {
	flex-shrink: 0;
	width: 4px;
	height: 4px;
	border-radius: 100%;
}
</style>
