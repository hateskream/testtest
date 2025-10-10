<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryMarketCap } from '../queries/use-query-market-cap.ts';
import { useMarketCapStore } from '../store/market-cap.ts';
import { BaseErrorComponent } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';
import MarketCapContextMenu from './market-cap-context-menu.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const marketCap = useMarketCapStore();

const { data, isLoading, isError, refetch } = useQueryMarketCap(computed(() => marketCap.selectedTickers));

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:data="data"
				:meta="meta"
			/>
		</template>
		<template #rcm>
			<market-cap-context-menu
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@delete="emit('delete')"
				@move-to="emit('moveTo', $event)"
				@duplicate="emit('duplicate')"
			/>
		</template>
	</base-dashboard-component>
</template>
