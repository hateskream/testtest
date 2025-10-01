<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryBintcoinDominance } from '../queries/use-query-bitcoin-dominance.ts';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance.ts';
import { BaseErrorComponent } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';
import BitcoinDominanceContextMenu from './bitcoin-dominance-context-menu.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: ErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const bitcoinDominanceStore = useBitcoinDominanceStore();

const { data, isLoading, isError, refetch } = useQueryBintcoinDominance(
	computed(() => bitcoinDominanceStore.selectedTickers),
);

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:data="data"
				:meta="meta"
			/>
		</template>
		<template #rcm>
			<bitcoin-dominance-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>
