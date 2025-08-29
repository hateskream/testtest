<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { useQueryTickers } from '../queries';
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
	tickerIds,

	handlerAddNewTab,
	handlerRenameTab,
	handlerSwitchTab,
	handlerDuplicateTab,
	handlerRemoveTab,

	resetAllChanges,

	handlerAddToWatchlist,
	handlerRemoveFromWatchlist,
} = useWatchlist(props.meta.widgetId);

const { data, isLoading, isError } = useQueryTickers(tickerIds);

const isNotData = computed(() => !!data?.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<watchlist-error v-if="isError" />

			<watchlist-loader v-if="isNotData" :count="5" />
			<watchlist-main
				v-if="data"
				:columns="columns"
				:sections="sections"
				:tickers="data"
				:tabs="tabs"
				@add-tab="handlerAddNewTab"
				@rename-tab="handlerRenameTab"
				@switch-tab="handlerSwitchTab"
				@duplicate-tab="handlerDuplicateTab"
				@add-ticker="handlerAddToWatchlist"
				@remove-ticker="handlerRemoveFromWatchlist"
				@delete-tab="handlerRemoveTab"
			/>
		</template>

		<template #rcm>
			<watchlist-context-menu
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-dashboard-component>
</template>
