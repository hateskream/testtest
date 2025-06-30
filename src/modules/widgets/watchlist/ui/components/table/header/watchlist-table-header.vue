<script setup lang="ts">
import draggableComponent from 'vuedraggable';

// import type { IWatchlistColumn, IWatchlistTickerState } from '../../../../model';
import { useWatchlistStore } from '../../../../stores';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';

import WatchlistSortableColumn from './watchlist-sortable-column.vue';
import WatchlistMetricsSelector from './watchlist-metrics-selector.vue';

// interface IWatchlistTableHeaderProps {
// 	columns: IWatchlistColumn[];
// 	tickerState: IWatchlistTickerState;
// }

// const props = defineProps<IWatchlistTableHeaderProps>();

const watchlistStore = useWatchlistStore();

const ignoreDragClass = 'ignoreDrag';

function getSortDirection(columnName: string) {
	return watchlistStore.activeSort.columnName === columnName ? watchlistStore.activeSort.direction : 0;
}

const { backgroundStyle } = useResizeBackground();
</script>

<template>
	<draggable-component
		:model-value="watchlistStore.activeTableColumns"
		tag="thead"
		item-key="position"
		:filter="`.${ignoreDragClass}`"
		:chosen-class="classes.dragActive"
		:ghost-class="classes.dragPlaceholder"
		:class="classes.thead"
		:delay="100"
		@update:model-value="watchlistStore.updateActiveTableColumns"
	>
		<template #item="{ element: column, index}">
			<th :class="{ [ignoreDragClass]: !column.isDraggable }">
				<watchlist-sortable-column
					:style="index === 0 ? backgroundStyle : {}"
					:column="column"
					:sort-direction="getSortDirection(column.columnName)"
					@click="watchlistStore.toggleActiveSort(column)"
				/>
			</th>
		</template>

		<template #footer>
			<th :class="[classes.iconTertiary]" :style="backgroundStyle">
				<watchlist-metrics-selector />
			</th>
		</template>
	</draggable-component>
</template>

<style module="classes">
.thead {
	position: sticky;
	top: 0;
	z-index: 2;
	display: table;
	min-width: 100%;
	table-layout: fixed;
}

.dragPlaceholder::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 2;
	width: 1px;
	height: 16px;
	background: var(--border-color-base-300);
	transform: translate(-50%, -50%);
}

.dragPlaceholder::after {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: calc(100% + 2px);
	height: calc(100% + 2px);
	color: var(--border-color-base-300);
	background: var(--bg-color-surface-01);
}


.thead th {
	position: relative;
	min-width: 100px;
	height: 28px;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-100);
	cursor: pointer;
	user-select: none;
}

.iconTertiary {
	position: sticky !important;
	top: 0;
	right: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 50px !important;
	padding-right: 8px;
}

.thead th:first-child {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 1;
}

.dragActive {
	display: flex;
	align-items: center;
	width: 100%;
	height: 28px;
	padding-inline: 10px !important;
	text-align: center !important;
	color: var(--text-color-base-100-effect) !important;
	background-color: var(--bg-tooltip-color-base) !important;
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	opacity: 1;
}
</style>
