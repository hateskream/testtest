<script setup lang="ts">
import draggable from 'vuedraggable';

import type { ITableRow, IWatchlistTickerState } from '../../../model';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';
import { tickerIcon, forexTickerIcon } from '@/shared/ui/ticker';
import { useWatchlistSectionStore } from '../../../stores/watchlist-section.store.ts';

import WatchlistCellNumber from './cells/watchlist-cell-number.vue';
import WatchlistCellPercent from './cells/watchlist-cell-percent.vue';
import WatchlistCellDate from './cells/watchlist-cell-date.vue';

interface IProps {
	rows: ITableRow[][];
	sectionId: string;
	tickerState: IWatchlistTickerState;
}

const props = defineProps<IProps>();
const emit = defineEmits(['row-dnd']);

const watchlistSectionStore = useWatchlistSectionStore();
const { backgroundStyle } = useResizeBackground();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDragChange = (evt: any, sectionId: string) => {
	// evt содержит moved, added, removed
	// sectionId — id секции-приёмника
	// evt.moved/evt.added/evt.removed содержат индексы и элементы

	// Если evt.moved — это перемещение внутри одной секции
	// Если evt.added/evt.removed — это перенос между секциями

	if (evt.moved) {
		watchlistSectionStore.moveRowInSection(
			sectionId,
			evt.moved.oldIndex,
			evt.moved.newIndex,
		);
	} else if (evt.added) {
		emit('row-dnd', { type: 'added', ...evt.added, sectionId: props.sectionId });
	} else if (evt.removed) {
		emit('row-dnd', { type: 'removed', ...evt.removed, sectionId: props.sectionId });
	}
};
</script>

<template>
	<draggable
		:list="props.rows"
		:group="'watchlist-rows'"
		item-key="0.id"
		tag="tbody"
		:class="classes.tbody"
		@change="onDragChange($event, props.sectionId)"
	>
		<template #item="{ element, index: elementIdx }">
			<tr
				:key="`${elementIdx}-table-tr`"
			>
				<td
					v-for="(item, index) in element"
					:key="item.value + item.id"
					:style="index === 0 ? backgroundStyle : {}"
				>
					<div
						:class="classes.rowColumnWrapper"
					>
						<div
							v-if="['image-string', 'image'].includes(item.type)"
							:class="classes.tableIcon"
						>
							<ticker-icon
								v-if="item.market?.toLowerCase() !== 'forex'
									&& !Array.isArray(item.srcValue)
									&& props.tickerState.isShowLogo"
								:src="item.srcValue"
								:ticker="item.value"
								:size="32"
							/>

							<forex-ticker-icon
								v-if="item.market?.toLowerCase() === 'forex'
									&& item.domain
									&& Array.isArray(item.srcValue)
									&& props.tickerState.isShowLogo"
								:src="item.srcValue"
								:ticker="item.value"
								:domain="item.domain"
								:size="40"
							/>

							<div :class="classes.tickerName">
								<span v-if="props.tickerState.isShowTicker">{{ item.value }}</span>
								<span
									v-if="item.market?.toLowerCase() === 'forex' && props.tickerState.isShowDescription"
									:class="classes.domainName"
								>
									{{ item.domain }}
								</span>
							</div>
						</div>

						<watchlist-cell-number
							v-else-if="item.type === 'number'"
							is-fiat
							format="pretty-with-key"
							:value="item.value"
						/>

						<watchlist-cell-percent
							v-else-if="item.type === 'percent'"
							:value="item.value"
						/>

						<watchlist-cell-date
							v-else-if="item.type === 'date'"
							:value="item.value"
						/>
					</div>
				</td>

				<td :class="classes.fixTertiaryIcon" />
			</tr>
		</template>
	</draggable>
</template>

<style module="classes">
.rowColumnWrapper {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 50px;
	padding: 8px 0;
	font-size: 13px;
	text-align: right;
	color: #ffffff;
}

.imageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
}

.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tbody {
	display: block;
	width: max-content;
	min-width: 100%;
}

.tbody > tr {
	display: table;
	width: max-content;
	min-width: 100%;
}

tbody tr:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

tbody tr:hover td:first-child .rowColumnWrapper {
	background-color: var(--border-color-surface-02-effect);
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

tbody tr td:first-child {
	position: sticky;
	top: 0;
	left: 0;
}

tbody tr td:first-child .rowColumnWrapper {
	position: relative;
	justify-content: flex-start;
}

tbody tr td:first-child .rowColumnWrapper::after {
	content: '';
	position: absolute;
	right: 0;
	width: 100%;
	height: 100%;
}

.tbody td {
	min-width: 100px;
}

.fixTertiaryIcon {
	min-width: 50px !important;
	padding-right: 8px;
}

.tickerName {
	display: inline-flex;
	gap: 2px;
}

.domainName {
	color: var(--text-color-base-300, #9a9a9d);
}
</style>
