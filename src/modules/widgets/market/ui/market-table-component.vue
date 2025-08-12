<script setup lang="ts">
import { computed } from 'vue';

import { useMarketStore } from '../stores';
import type { IMarketDomain } from '../api';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ColumnType,
	mapNumberToTable,
	mapPercentToTable,
	mapSymbolToTable,
	mapTextToTable,
	mapToTableColumnType,
} from '@/modules/cell';
import type { ITableColumn } from '../model';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	markets: IMarketDomain[];
}

const props = defineProps<IViewComponentProps>();
const marketStore = useMarketStore();


const genericColumns = computed(() =>
	mapColumn(marketStore.activeTableColumns),
);

const genericRows = computed(() =>
	props.markets.map(ticker => mapRow(ticker)),
);

function mapColumn(marketColumns: ITableColumn[]) {
	return marketColumns.map(col => ({
		key: col.columnType.toString(),
		label: col.displayColumnName,
		shortLabel: col.displayShortColumnName,
		position: col.position,
		sortable: true,
		draggable: col.isDraggable,
		visible: col.isShow,
		type: mapToTableColumnType[col.type],
		group: {
			name: col.group.name,
			displayName: col.group.name.charAt(0).toUpperCase() + col.group.name.slice(1),
		},
	}));
}

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
