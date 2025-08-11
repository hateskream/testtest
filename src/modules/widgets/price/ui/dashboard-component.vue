<script setup lang="ts">
import { BaseDashboardComponent } from '../../base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { usePrice } from '../composables';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import PriceListContextMenu from './price-list-context-menu.vue';

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
} = usePrice();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<error-component v-if="fetchTickersError" />
			<preloader-component v-else-if="isNotData" />
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
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-dashboard-component>
</template>
