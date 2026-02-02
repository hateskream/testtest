<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { useQueryMarket } from '../../queries';
import type { IMeta } from '@/modules/dashboard-group';
import { useMarket } from '../../composables';
import { NONE_SET_FILTER } from '../../model';
import { BaseErrorComponent, BaseWidgetDashboard, ModalSubmenu } from '@/modules/widgets/base';

import PreloaderComponent from '../common/preloader-component.vue';
import TableColumnsSettingsComponent from '../common/table-columns-settings-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

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

	watchlists,

	resetAllChanges,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
} = useMarket({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

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
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:all-display-variants="props.meta.allDisplayVariants"
		:active-display-variant="props.meta.activeDisplayVariant"
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@retry="refetch"
	>
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
				display-variant="new"
				:filters-values="filtersValues"
				:rows="rows"
				:watchlists="watchlists"
				@add-to-watchlist="handleAddToWatchlist"
				@remove-from-watchlist="handleRemoveFromWatchlist"
				@add-to-new-watchlist="handleAddTickerInNewWatchlist"
			/>
		</template>
		<template #change-display>
			<modal-submenu>
				<template #title> Column metrics </template>
				<template #content>
					<table-columns-settings-component v-model="columns" />
				</template>
			</modal-submenu>
		</template>
	</base-widget-dashboard>
</template>
