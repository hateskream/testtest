<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import { useQueryPerformance } from '@/modules/widgets/performance/queries';
import { ALL_COLUMNS } from '../model';
import { usePerformance } from '../composables';

import PerformanceLoader from './layouts/performance-loader.vue';
import PerformanceContextMenu from './modals/performance-context-menu.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./layouts/performance-view.vue'),
	loadingComponent: PerformanceLoader,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const {
	currentStock,
	currentDate,
	currentDisplayVariant,
	isCompactMode,
	resetAllChanges,
} = usePerformance(props.meta.widgetId);

const { data, isLoading, isError, refetch } = useQueryPerformance(
	currentStock,
	currentDate,
	10,
);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<performance-loader v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data"
				v-model:is-compact-mode="isCompactMode"
				v-model:display-variant="currentDisplayVariant"
				v-model:stock="currentStock"
				v-model:date="currentDate"
				:rows="rows"
				:columns="ALL_COLUMNS"
			/>
		</template>

		<template #rcm>
			<performance-context-menu
				v-model:is-compact-mode="isCompactMode"
				v-model:display-variant="currentDisplayVariant"
				v-model:stock="currentStock"
				v-model:date="currentDate"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-dashboard-component>
</template>
