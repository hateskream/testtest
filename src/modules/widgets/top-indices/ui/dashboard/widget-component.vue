<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseWidgetDashboard, BaseErrorComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group';
import { useQueryTopIndices } from '../../queries';
import { ALL_COLUMNS } from '../../model';
import { ErrorNetworkComponent } from '@/modules/widgets/base';
import { LoaderLayout } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-layout.vue'),
	loadingComponent: LoaderLayout,
	errorComponent: BaseErrorComponent,
});

interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const limit = computed(() => props.meta.maxCountRowTable ?? 50);

const { data, isLoading, isError, refetch } = useQueryTopIndices(limit);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => isLoading.value || props.meta.isLoading);
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
	>
		<template #content>
			<error-network-component v-if="isError" @retry="refetch" />
			<loader-layout
				v-else-if="isNotData && !isError"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else
				:meta="props.meta"
				:rows="rows"
				:columns="ALL_COLUMNS"
				display-variant="dashboard"
			/>
		</template>
	</base-widget-dashboard>
</template>
