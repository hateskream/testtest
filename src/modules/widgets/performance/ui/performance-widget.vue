<script setup lang="ts">
import { ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/model';
import type { IPerformanceFilter } from '@/modules/widgets/performance/model';
import { BaseDashboardComponent } from '@/modules/widgets/base';
import { useQueryPerformance } from '@/modules/widgets/performance/queries';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';

import ErrorComponent from './layouts/error-component.vue';
import PreloaderComponent from './layouts/preloader-component.vue';
import ViewComponent from './layouts/view-component.vue';
import RcmPerformanceComponent from './layouts/rcm-performance.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const performanceStore = usePerformanceStore();

const filters = ref<IPerformanceFilter>(performanceStore.currentFilter);

const { data, isLoading, isError } = useQueryPerformance(filters.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>

		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isLoading" />

			<view-component
				v-else-if="data"
				:performance-data="data"
				:size="{ width: meta.size.w, height: meta.size.h }"
			/>
		</template>

		<template #rcm>
			<rcm-performance-component />
		</template>
	</base-dashboard-component>
</template>
