<script setup lang="ts">
import { computed } from 'vue';

import { useQueryMarket } from '../queries';
import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent } from '../../base';
import { useMarket } from '../composables';
import { NONE_SET_FILTER } from '../model';
import { BaseErrorComponent } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import MarketContextMenu from './market-context-menu.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	columns,
	activeMarket,
	activeSort,
	filtersValues,
	filtersState,

	wachlists,

	resetAllChanges,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
} = useMarket(props.meta.widgetId);

const { data, isLoading, isError, refetch } = useQueryMarket(
	activeMarket,
	activeSort,
	computed(
		() => Object
			.entries(filtersState.value)
			.map(([filter, { selected: value }]) => ({
				filter,
				value,
			}))
			.filter(({ value }) => value === NONE_SET_FILTER),
	),
	10,
);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => (!rows.value.length && isLoading.value) || props.meta.isLoading);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else
				v-model:filters="filtersState"
				v-model:market="activeMarket"
				v-model:columns="columns"
				:filters-values="filtersValues"
				:rows="rows"
				:wachlists="wachlists"
				@add-to-watchlist="handleAddToWatchlist"
				@remove-from-watchlist="handleRemoveFromWatchlist"
				@add-to-new-watchlist="handleAddTickerInNewWatchlist"
			/>
		</template>
		<template #rcm>
			<market-context-menu
				v-model="columns"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>

	</base-dashboard-component>
</template>
