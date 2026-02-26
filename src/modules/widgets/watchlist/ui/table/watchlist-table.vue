<script setup lang="ts">
import { computed } from 'vue';

import {
	type ISectionUi,
	type ITickerAddPayload,
	type ITickerRemovePayload,
	type ITickersAddPayload,
	mapSections,
} from '../../model';
import { type ITableColumn, mapColumn, type TableRow } from '@/modules/cell';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useGoToTickerPage } from '@/modules/chart';
import { UiPosition } from '@/shared/ui/position';
import {
	decodeCanonicalTickerId,
	type ITickerItem,
	SelectionMode,
	TickerSelectorModal,
} from '@/modules/ticker-selector';
import { ALL_MARKET_TYPES } from '@/modules/market';

import WatchlistEmptyState from './watchlist-empty-state.vue';
import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IWatchlistTableProps {
	selectedTickers: string[];
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISectionUi[];
	displayVariant: 'new' | 'default';
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

function selectTicker(ticker: ITickerItem) {
	emit('add-ticker', { tickerId: ticker.canonical_ticker_id, tickerType: ticker.market_type });
}

function unselectTicker(ticker: ITickerItem) {
	emit('remove-ticker', { tickerId: ticker.canonical_ticker_id });
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
						<template #title>
							<ui-icon
								:id="IconIds.Plus"
								height="20px"
								width="20px"
								:class="classes.icon"
							/>
						</template>
						<template #content>
							<ticker-selector-modal
								:enabled-markets="ALL_MARKET_TYPES"
								:selected-tickers="selectedTickers.map(decodeCanonicalTickerId)"
								:selection-mode="SelectionMode.Single"
								:display-variant="props.displayVariant"
								@ticker-selected="selectTicker"
								@ticker-unselected="unselectTicker"
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
			:display-variant="props.displayVariant"
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
