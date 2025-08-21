<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent } from '@/modules/widgets/base';
import { useQueryPerformance } from '@/modules/widgets/performance/queries';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import { ALL_COLUMNS } from '../model';

import PerformanceError from './layouts/performance-error.vue';
import PerformanceLoader from './layouts/performance-loader.vue';
import PerformanceView from './layouts/performance-view.vue';
import PerformanceContextMenu from './modals/performance-context-menu.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const performanceStore = usePerformanceStore();

const filters = computed(() => performanceStore.currentFilter);

const { data, isLoading, isError } = useQueryPerformance(filters);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>

		<template #content>
			<performance-error v-if="isError" />
			<performance-loader v-else-if="isLoading" />
			<performance-view
				v-else-if="data"
				:rows="rows"
				:columns="ALL_COLUMNS"
			/>
		</template>

		<template #rcm>
			<performance-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>
