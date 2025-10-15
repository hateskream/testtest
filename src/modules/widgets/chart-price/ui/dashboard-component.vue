<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group';
import { useChartPrice } from '../composables';
import { BaseErrorComponent, ModalSubmenu } from '@/modules/widgets/base';
import { ModalTickerSelector } from '@/modules/ticker-selector';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
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
	wachlists,

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


function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}
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
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<preloader-component v-if="props.meta.isLoading" />
			<view-component
				v-else
				v-model:selected-ticker="selectedTicker"
				v-model:time-range="timeRange"
				:wachlists="wachlists"
				:meta="meta"
				@add-to-watchlist="handleAddToWatchlist"
				@remove-from-watchlist="handleRemoveFromWatchlist"
				@add-to-new-watchlist="handleAddTickerInNewWatchlist"
			/>
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
	</base-dashboard-component>
</template>
