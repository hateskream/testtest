<script setup lang="ts">
import { computed, defineAsyncComponent, useTemplateRef, watch } from 'vue';
import { notNullish } from '@vueuse/core';

import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group/layout-dashboards/composables';
import { usePriceState } from '../../composables';
import { FilterComponent, PreloaderComponent } from '../common';
import type { IInfiniteStateHandler } from '@/shared/ui/infinite-loading';
import { useGoToTickerPage } from '@/modules/ticker';
import { getDefaultsState, type IState } from '../../model';
import { useWidgetState } from '@/modules/widgets/base/composables';

import RcmPriceComponent from '@/modules/widgets/price/ui/tv/rcm-price-component.vue';

interface IWidgetExposed {
	scrollBy: (px: number) => void;
}

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const { updateState, setStateType } = useWidgetContext();

const refView = useTemplateRef<IWidgetExposed>('refView');

const { state: widgetState } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState: () => getDefaultsState(props.meta.defaultStateType),
	onStateChange: (s) => updateState(s),
});

const {
	activeMarket,
	currentSettings,
	tickers,
	fetchTickersError,
	togglePin,
	refetch,
	filtersValues,
	filtersState,
	hasPin,
	loadMore,
	hasNextPage,
	tickersIsLoading,
	resetAllChanges,
} = usePriceState({
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: () => (props.meta.maxCountRowTable || 50),
	state: widgetState,
});

const { goToTickerPage } = useGoToTickerPage();

watch(activeMarket, (value) => {
	setStateType(value.charAt(0).toUpperCase() + value.slice(1));
});

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

const hasInfinityLoading = computed(() => !notNullish(props.meta.maxCountRowTable));

function scrollBy(px: number) {
	if (!refView.value) {
		return;
	}

	refView.value.scrollBy(px);
}

defineExpose({ scrollBy });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@reset="resetAllChanges"
		@retry="refetch"
	>
		<template #filters>
			<filter-component
				v-model:market="activeMarket"
				v-model:filters="filtersState"
				:filters-values="filtersValues"
				display-type="dashboard"
				@reset="resetAllChanges"
			/>
		</template>
		<template #content>
			<base-error-component v-if="fetchTickersError" @retry="refetch" />
			<preloader-component
				v-else-if="tickersIsLoading || props.meta.isLoading"
				:class="classes.preloader"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else
				ref="refView"
				display-variant="new"
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				:has-pin="hasPin"
				:has-infinity-loading="hasInfinityLoading"
				@load-more="loadMoreTickets"
				@toggle-pin="togglePin"
				@ticker-select="goToTickerPage($event)"
			/>
		</template>

		<template #change-display>
			<rcm-price-component v-model="currentSettings" />
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.preloader {
	padding: 0 20px;
}
</style>
