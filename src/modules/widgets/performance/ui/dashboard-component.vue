<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryPerformance } from '../queries';
import { usePerformanceStore } from '../stores';
import type { IMeta } from '@/modules/dashboard-group/model';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import RcmPerformanceComponent from './rcm-performance.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const performanceStore = usePerformanceStore();

const { data, isLoading, isError, refetch } = useQueryPerformance({
	type: performanceStore.currentFilter.type,
	timeRange: performanceStore.currentFilter.timeRange,
});

const isNotData = computed(() => !data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>

		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:performance-data="data"
				:size="{ width: meta.size.w, height: meta.size.h }"
				@refetch="refetch"
			/>
		</template>

		<template #rcm>
			<rcm-performance-component />
		</template>
	</base-dashboard-component>
</template>
