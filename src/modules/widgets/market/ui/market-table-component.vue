<script setup lang="ts">
import { computed } from 'vue';

import { useMarketStore } from '../stores';
import type { IMarketDomain } from '../api';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	CellType,
	ColumnType,
	mapNumberToTable,
	mapPercentToTable,
	mapSymbolToTable,
	mapTextToTable,
	mapToTableColumnType,
} from '@/modules/cell';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	markets: IMarketDomain[];
}

const props = defineProps<IViewComponentProps>();
const marketStore = useMarketStore();

const col = [
	{
		'key': ColumnType.Symbol.toString(),
		'label': 'Symbol',
		'shortLabel': 'Symbol',
		'position': 0,
		'sortable': true,
		'draggable': false,
		'visible': true,
		'type': mapToTableColumnType[CellType.Symbol],
		'group': {
			'name': 'symbol',
			'displayName': 'Symbol',
		},
	},
	{
		'key': [ColumnType.PriceCurrent].toString(),
		'label': 'Price',
		'shortLabel': 'Price',
		'position': 1,
		'sortable': true,
		'draggable': true,
		'visible': true,
		'type': mapToTableColumnType[CellType.Number],
		'group': {
			'name': 'price',
			'displayName': 'Price',
		},
	},
	{
		'key': [ColumnType.ChangePrice24hPercent].toString(),
		'label': 'Change 24h%',
		'shortLabel': 'Chg 24h%',
		'position': 2,
		'sortable': true,
		'draggable': true,
		'visible': true,
		'type': mapToTableColumnType[CellType.Percent],
		'group': {
			'name': 'change',
			'displayName': 'Change',
		},
	},
	{
		'key': [ColumnType.Volume24h].toString(),
		'label': 'Volume 24h',
		'shortLabel': 'Vol 24h',
		'position': 3,
		'sortable': true,
		'draggable': true,
		'visible': true,
		'type': mapToTableColumnType[CellType.Number],
		'group': {
			'name': 'volume',
			'displayName': 'Volume',
		},
	},
	{
		'key': [ColumnType.MarketCap24h].toString(),
		'label': 'Market cap 24h',
		'shortLabel': 'MCap 24h',
		'position': 4,
		'sortable': true,
		'draggable': true,
		'visible': true,
		'type': mapToTableColumnType[CellType.Number],
		'group': {
			'name': 'MCap',
			'displayName': 'MCap',
		},
	},
	{
		'key': [ColumnType.ListingDate].toString(),
		'label': 'Listing Date',
		'shortLabel': 'Listing Date',
		'position': 5,
		'sortable': true,
		'draggable': true,
		'visible': true,
		'type': mapToTableColumnType[CellType.Text],
		'group': {
			'name': 'Date',
			'displayName': 'Date',
		},
	},
];


const genericColumns = computed(() =>
	// adaptMarketColumnsToGeneric(marketStore.activeTableColumns),
	col,
);

const genericRows = computed(() =>
	props.markets.map(ticker => mapRow(ticker)),
);

function mapRow(ticker: IMarketDomain) {
	return {
		id: ticker.tickerId,
		data: {
			[ColumnType.Symbol]: mapSymbolToTable(ticker.symbol),
			[ColumnType.PriceCurrent]: mapNumberToTable(ticker.priceCurrent),
			[ColumnType.ChangePrice24hPercent]: mapPercentToTable(ticker.changePrice24hPercent),
			[ColumnType.Volume24h]: mapNumberToTable(ticker.volume24h),
			[ColumnType.MarketCap24h]: mapNumberToTable(ticker.marketCap),
			[ColumnType.ListingDate]: mapTextToTable(ticker.listingDate),
		},
	};
}
</script>

<template>

	<div :class="classes.scrollable">

		<widget-typed-table
			:columns="genericColumns"
			:rows="genericRows"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="true"
			:show-header="true"
		>
			<template #row-actions>
				<div :class="classes.favorite">
					<ui-icon
						:id="IconIds.Favorite"
						width="16px"
						height="16px"
					/>
				</div>
			</template>
		</widget-typed-table>
	</div>

</template>

<style module="classes">
.scrollable {
	position: relative;
	height: 100%;
}

.favorite {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: color 0.2s ease-in;

	&:hover {
		color: var(--text-color-base-300-effect);
	}
}
</style>
