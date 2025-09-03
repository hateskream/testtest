<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	mapRow,
	mapColumn,
	type ITableColumn,
	type TableRow,
} from '@/modules/cell';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { isOnWatchlist, type IWatchlistAction, type IWatchlistData } from '../model';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	rows: TableRow[];
	wachlists: IWatchlistData[];
}

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', wachlists: IWatchlistAction): void;
	(e: 'remove-from-watchlist', wachlists: IWatchlistAction): void;
}>();

const columns = defineModel<ITableColumn[]>('columns', { required: true });

const genericColumns = computed(() =>
	mapColumn(columns.value),
);

const genericRows = computed(() =>
	props.rows.map(ticker => mapRow(ticker)),
);

function clickRowAction(watchlist: IWatchlistData, tickerId: string) {
	const payload: IWatchlistAction = {
		watchlistId: watchlist.watchlistId,
		tickerId,
	};

	if (isOnWatchlist(watchlist, tickerId)) {
		emits('remove-from-watchlist', payload);
	} else {
		emits('add-to-watchlist', payload);
	}
}

function clickNewWatchlist(tickerId: string) {
	console.log('clickNewWatchlist', tickerId);
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
			<template #row-actions="{tickerId} : {tickerId: string}">
				<modal-badge>
					<template #title>
						<div
							:class="classes.favorite"
						>
							<ui-icon
								:id="IconIds.Favorite"
								width="16px"
								height="16px"
							/>
						</div>
					</template>
					<template #content>
						<modal-badge-list>
							<template #title>Add to watchlist</template>

							<template v-for="watchlist in props.wachlists" :key="watchlist.tabId">
								<modal-item-selector
									:model-value="isOnWatchlist(watchlist, tickerId)"
									@update:model-value="clickRowAction(watchlist, tickerId)"
								>
									{{ watchlist.name }}
								</modal-item-selector>
							</template>

							<div @click="clickNewWatchlist(tickerId)">
								Add new watchlist
							</div>
						</modal-badge-list>
					</template>
				</modal-badge>
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
