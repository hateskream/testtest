<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryPrice } from '../queries';
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

const { activeMarket, currentSettings, resetAllChanges } = usePrice();

const fakeReq = computed(() => ({
	market: '',
	pined: [],
	offset: 0,
	limit: 0,
}));

const { data, isLoading, isError } = useQueryPrice(fakeReq);

const isNotData = computed(() => !!data.value && isLoading.value);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				v-model="activeMarket"
				:tickers="data.tickers"
				:settings="currentSettings"
				:meta="meta"
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
