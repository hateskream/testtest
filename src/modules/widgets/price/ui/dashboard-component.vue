<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { usePrice } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';
import PriceListContextMenu from './price-list-context-menu.vue';

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
	activeMarket,
	currentSettings,
	tickers,
	fetchTickersError,
	isNotData,
	resetAllChanges,
	togglePin,
	refetch,
} = usePrice(props.meta.widgetId, props.meta.defaultStateType);

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<base-error-component v-if="fetchTickersError" @retry="refetch" />
			<preloader-component v-else-if="isNotData || props.meta.isLoading" />
			<view-component
				v-else
				v-model="activeMarket"
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				@toggle-pin="togglePin"
			/>
		</template>
		<template #rcm>
			<price-list-context-menu
				v-model="currentSettings"
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@delete="emit('delete')"
				@reset="resetAllChanges"
				@move-to="emit('moveTo', $event)"
				@duplicate="emit('duplicate')"
			/>
		</template>
	</base-dashboard-component>
</template>
