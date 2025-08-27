<script setup lang="ts">
import { computed, ref } from 'vue';

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
import type { IWatchlist } from '../model';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	rows: TableRow[];
	wachlists: IWatchlist[];
}

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', wachlists: IWatchlist, tickerId: string): void;
}>();

const columns = defineModel<ITableColumn[]>('columns', { required: true });

const selectedWatchlist = ref<IWatchlist | null>(null);

const genericColumns = computed(() =>
	mapColumn(columns.value),
);

const genericRows = computed(() =>
	props.rows.map(ticker => mapRow(ticker)),
);

function handleAddToWatchlist(wachlists: IWatchlist, tickerId: string) {
	selectedWatchlist.value = wachlists;

	emits('add-to-watchlist', wachlists, tickerId);
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
									:model-value="watchlist === selectedWatchlist"
									@update:model-value="handleAddToWatchlist(watchlist, tickerId)"
								>
									{{ watchlist.name }}
								</modal-item-selector>
							</template>
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
