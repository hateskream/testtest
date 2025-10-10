<script setup lang="ts">
import { computed } from 'vue';

import {
	mapRow,
	mapColumn,
	type ITableColumn,
	type TableRow,
} from '@/modules/cell';
import { type IWatchlistAction } from '../model';
import { useGoToTickerPage } from '@/modules/chart';
import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	rows: TableRow[];
	wachlists: IWatchlistData[];
}

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', wachlists: IWatchlistAction): void;
	(e: 'remove-from-watchlist', wachlists: IWatchlistAction): void;
	(e: 'add-to-new-watchlist', tickerId: string): void;
}>();

const columns = defineModel<ITableColumn[]>('columns', { required: true });

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() =>
	mapColumn(columns.value),
);

const genericRows = computed(() =>
	props.rows.map(ticker => mapRow(ticker)),
);
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
			@click-on-ticker="goToTickerPage"
		>
			<template #row-actions="{tickerId} : {tickerId: string}">
				<add-to-watchlist
					:ticker-id="tickerId"
					:wachlists="props.wachlists"
					@add-to-watchlist="emits('add-to-watchlist', $event)"
					@remove-from-watchlist="emits('remove-from-watchlist', $event)"
					@add-to-new-watchlist="emits('add-to-new-watchlist', $event)"
				/>
			</template>
		</widget-typed-table>
	</div>

</template>

<style module="classes">
.scrollable {
	position: relative;
	height: 100%;
}
</style>
