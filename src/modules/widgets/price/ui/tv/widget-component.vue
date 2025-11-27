<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { usePrice } from '../../composables';
import { PreloaderComponent } from '../common';
import type { IInfiniteStateHandler } from '@/shared/ui/infinite-loading/model.ts';

import RcmPriceComponent from './rcm-price-component.vue';
import HeaderComponent from './header-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	activeMarket,
	currentSettings,
	tickers,
	fetchTickersError,
	resetAllChanges,
	togglePin,
	loadMore,
	refetch,
	filtersValues,
	filtersState,
	applyStateToParent,
	hasPin,
	hasNextPage,
	tickersIsLoading,
} = usePrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: props.meta.maxCountRowTable,
});

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

async function loadMoreTickets(state: IInfiniteStateHandler) {
	await loadMore();

	if (fetchTickersError.value) {
		state.error();
	} else if (hasNextPage.value) {
		state.loaded();
	} else {
		state.complete();
	}
}
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
	>
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<base-error-component v-if="fetchTickersError" @retry="refetch" />
			<preloader-component v-else-if="tickersIsLoading || props.meta.isLoading" />
			<view-component
				v-else
				display-variant="default"
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				:has-pin="hasPin"
				has-infinity-loading
				@load-more="loadMoreTickets"
				@toggle-pin="togglePin"
			>
				<template #header>
					<header-component
						v-model:market="activeMarket"
						v-model:filters="filtersState"
						:filters-values="filtersValues"
						:class="classes.header"
					/>
				</template>
			</view-component>
		</template>
		<template #change-display>
			<rcm-price-component v-model="currentSettings" />
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.header {
	margin-bottom: 10px;
}
</style>
