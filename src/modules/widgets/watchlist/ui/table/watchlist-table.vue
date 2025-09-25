<script setup lang="ts">
import { computed } from 'vue';

import {
	mapSections,
	type ISectionUi,
	type ITickerAddPayload,
	type ITickerRemovePayload,
	type ITickersAddPayload,
} from '../../model';
import { mapColumn, type ITableColumn, type TableRow } from '@/modules/cell';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useGoToTickerPage } from '@/modules/chart';
import { findSectionTypeById } from '@/modules/watchlist';
import type { MarketType } from '@/modules/market';
import { UiPosition } from '@/shared/ui/position';
import { ModalTickerSelector } from '@/modules/ticker-selector';

import WatchlistEmptyState from './watchlist-empty-state.vue';
import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IWatchlistTableProps {
	selectedTickers: string[];
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISectionUi[];
}

const props = defineProps<IWatchlistTableProps>();

const emit = defineEmits<{
	(event: 'add-ticker', payload: ITickerAddPayload): void;
	(event: 'remove-ticker', payload: ITickerRemovePayload): void;
	(event: 'add-tickers', payload: ITickersAddPayload): void;
	(event: 'remove-section', id: string): void;
}>();

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() => mapColumn(props.columns));

const genericSections = computed(() => mapSections(props.sections, props.tickers));

function selectTicker(tickerId: string, sectionId: string) {
	const marketType = findSectionTypeById(props.sections, sectionId);

	if (!marketType) {
		return;
	}

	emit('add-ticker',
		{
			tickerId,
			tickerType: marketType as MarketType,
		},
	);
}
</script>

<template>
	<div :class="classes.watchlistTable">
		<widget-typed-table
			v-if="genericSections.length > 0"
			:sections="genericSections"
			:columns="genericColumns"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="true"
			:show-header="true"
			@click-on-ticker="goToTickerPage"
		>
			<template #row-actions="{tickerId} : {tickerId: string}">
				<ui-icon
					:id="IconIds.TrashOutline"
					@click="emit('remove-ticker', { tickerId })"
				/>
			</template>
			<template #section-actions="{ sectionId }">
				<button
					class="action-button"
					:title="sectionId"
				>
					<ui-position
						strategy="absolute"
					>
						<template #default>
							<ui-icon
								:id="IconIds.Plus"
								height="20px"
								width="20px"
								:class="classes.icon"
							/>
						</template>
						<template #content>
							<modal-ticker-selector
								:model-value="selectedTickers"
								:enable-select-all="false"
								@select="selectTicker($event, sectionId)"
								@unselect="emit('remove-ticker', { tickerId: $event })"
							/>
						</template>
					</ui-position>
				</button>

				<button
					class="action-button delete-button"
					:title="sectionId"
					@click="emit('remove-section', sectionId)"
				>
					<ui-icon
						:id="IconIds.TrashClose"
						height="20px"
						width="20px"
						:class="classes.icon"
					/>
				</button>
			</template>
		</widget-typed-table>
		<watchlist-empty-state
			v-else
			@add-ticker="emit('add-ticker', $event)"
			@remove-ticker="emit('remove-ticker', $event)"
			@add-tickers="emit('add-tickers', $event)"
		/>
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.icon {
	color: rgb(100 101 104 / 100%);
	cursor: pointer;
}

.icon:hover {
	color: rgb(255 255 255 / 100%);
}
</style>
