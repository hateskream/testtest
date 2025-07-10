<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '@/modules/widgets/base';
import { useQueryPerformance } from '@/modules/widgets/performance/queries';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';

import PerformanceError from './layouts/performance-error.vue';
import PerformanceLoader from './layouts/performance-loader.vue';
import PerformanceView from './layouts/performance-view.vue';
import PerformanceRcm from './modals/performance-rcm.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const performanceStore = usePerformanceStore();

// Reactive filter from store
const filters = computed(() => performanceStore.currentFilter);

const { data, isLoading, isError } = useQueryPerformance(filters);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>

		<template #content>
			<performance-error v-if="isError" />
			<performance-loader v-else-if="isLoading" />
			<performance-view
				v-else-if="data"
				:performance-data="data"
				:size="{ width: meta.size.w, height: meta.size.h }"
			/>
		</template>

		<template #rcm>
			<performance-rcm />
		</template>
	</base-dashboard-component>
</template>
