<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { notNullish } from '@vueuse/core';

import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { usePrice } from '../../composables';
import { FilterComponent, PreloaderComponent } from '../common';
import type { IInfiniteStateHandler } from '@/shared/ui/infinite-loading';

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
	(e: 'set-widget-state-type', widgetId: string, value: string): void;
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const refView = ref<IWidgetExposed | null>(null);

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
} = usePrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: () => (props.meta.maxCountRowTable || 50),
});

watch(activeMarket, (value) => {
	emits(
		'set-widget-state-type',
		props.meta.widgetId,
		value.charAt(0).toUpperCase() + value.slice(1),
	);
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
