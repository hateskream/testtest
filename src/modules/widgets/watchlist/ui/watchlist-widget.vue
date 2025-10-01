<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { useQueryTickers } from '../queries';
import { useWatchlistWidget } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

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
	selectedTickers,

	addNewWatchlist,
	renameWatchlist,
	handlerSwitchTab,
	duplicateWatchlist,
	removeWatchlist,

	resetAllChanges,

	handlerAddToWatchlist,
	handlerRemoveFromWatchlist,
	handlerAddTickersToWatchlist,

	createNewWatchlist,

	handlerRemoveSectionFromWatchlist,
} = useWatchlistWidget(props.meta.widgetId);

const { data, isLoading, isError, refetch } = useQueryTickers(selectedTickers);

const isNotData = computed(() => (!!data?.value && isLoading.value) || props.meta.isLoading);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>

			<watchlist-loader v-else-if="isNotData" :count="5" />
			<watchlist-main
				v-else-if="data"
				:columns="columns"
				:sections="sections"
				:tickers="data"
				:tabs="tabs"
				:selected-tickers="selectedTickers"
				@add-tab="addNewWatchlist"
				@rename-tab="renameWatchlist"
				@switch-tab="handlerSwitchTab"
				@duplicate-tab="duplicateWatchlist"
				@add-ticker="handlerAddToWatchlist"
				@remove-ticker="handlerRemoveFromWatchlist"
				@delete-tab="removeWatchlist"
				@create-new-watchlist="createNewWatchlist"
				@add-tickers="handlerAddTickersToWatchlist"
				@remove-section="handlerRemoveSectionFromWatchlist"
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
