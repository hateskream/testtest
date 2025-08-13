<script setup lang="ts">
import { computed } from 'vue';

import { useQueryMarket } from '../queries';
import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent } from '../../base';
import { useMarket } from '../composables';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import MarketContextMenu from './market-context-menu.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError } = useQueryMarket({
	market: props.meta.market,
});

const {
	columns,
	activeMarket,
	// activeSort,
	filtersValues,
	filtersState,

	resetAllChanges,
} = useMarket();

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
				v-model:filters="filtersState"
				v-model:market="activeMarket"
				v-model:columns="columns"
				:filters-values="filtersValues"
				:rows="data"
			/>
		</template>
		<template #rcm>
			<market-context-menu
				v-model="columns"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-dashboard-component>
</template>
