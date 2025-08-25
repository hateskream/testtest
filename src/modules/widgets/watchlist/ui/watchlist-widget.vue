<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { useQueryWatchlistData } from '../queries';
import { useWatchlist } from '../composables';

import WatchlistError from './views/watchlist-error.vue';
import WatchlistLoader from './views/watchlist-loader.vue';
import WatchlistContextMenu from './watchlist-context-menu.vue';
import WatchlistMain from './views/watchlist-main.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const {
	tabs,
	columns,
	sections,

	handlerAddNewTab,
	handlerRenameTab,
	handlerSwitchTab,
} = useWatchlist(props.meta.widgetId);

const { data: tableData, isLoading: isTableLoading, isError: isTableError } = useQueryWatchlistData(
	{
		tabId: '',
	},
);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<watchlist-error v-if="isTableError" />

			<watchlist-loader v-if="isTableError || isTableLoading" :count="5" />
			<watchlist-main
				v-if="tableData && !isTableError"
				:columns="columns"
				:sections="sections"
				:tickers="tableData.tickers"
				:tabs="tabs"
				@add-tab="handlerAddNewTab"
				@rename-tab="handlerRenameTab"
				@switch-tab="handlerSwitchTab"
			/>
		</template>

		<template #rcm>
			<watchlist-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>
