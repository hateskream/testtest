<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent, ModalSubmenu } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { ModalTickerSelector } from '@/modules/ticker-selector';
import { useChartPrice } from '../../composables';
import { FiltersComponent, PreloaderComponent } from '../common';

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
	selectedTicker,
	timeRange,
	watchlists,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
	resetAllChanges,
	applyStateToParent,
} = useChartPrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isBig = computed(() => props.meta.size.h >= 6 );

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
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
			<preloader-component v-if="props.meta.isLoading" />
			<view-component
				v-else
				:meta="meta"
				is-show-time-range
				display-variant="tv"
			>
				<template #filters>
					<filters-component
						v-model:selected-ticker="selectedTicker"
						v-model:time-range="timeRange"
						:is-big="isBig"
						:watchlists="watchlists"
						display-variant="default"
						@add-to-watchlist="handleAddToWatchlist"
						@remove-from-watchlist="handleRemoveFromWatchlist"
						@add-to-new-watchlist="handleAddTickerInNewWatchlist"
					/>
				</template>
			</view-component>
		</template>
		<template #other>
			<modal-submenu>
				<template #title>Choose ticker</template>
				<template #content>
					<modal-ticker-selector
						:model-value="[selectedTicker]"
						:enable-selected-info="false"
						:enable-select-all="false"
						selection-mode="single"
						@update:model-value="updateTicker"
					/>
				</template>
			</modal-submenu>
		</template>
	</base-widget-tv-component>
</template>
