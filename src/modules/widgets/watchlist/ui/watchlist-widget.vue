<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';

import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group';
import { useQueryTickers } from '../queries';
import { useWatchlistWidget } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';
import type { Ticker } from '@/modules/widgets/watchlist/model';

import WatchlistLoader from './views/watchlist-loader.vue';

const WatchlistMain = defineAsyncComponent({
	loader: () => import('./views/watchlist-main.vue'),
	loadingComponent: WatchlistLoader,
	errorComponent: BaseErrorComponent,
});

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
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

	applyStateToParent,
} = useWatchlistWidget({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

const lastData = ref<Ticker[]>([]);

const { data, isError, refetch } = useQueryTickers(selectedTickers);

watch(data, (newVal) => {
	if (newVal) {
		lastData.value = newVal;
	}
});

const safeData = computed(() => data.value ?? lastData.value);
</script>

<template>
	<base-dashboard-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
	>
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>

			<watchlist-loader v-else-if="!safeData?.length" />

			<watchlist-main
				v-else
				:columns="columns"
				:sections="sections"
				:tickers="safeData"
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
	</base-dashboard-component>
</template>
