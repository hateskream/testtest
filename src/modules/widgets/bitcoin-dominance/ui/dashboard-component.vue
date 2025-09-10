<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryBintcoinDominance } from '../queries/use-query-bitcoin-dominance.ts';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance.ts';

import ViewComponent from './view-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ErrorComponent from './error-component.vue';
import BitcoinDominanceContextMenu from './bitcoin-dominance-context-menu.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const bitcoinDominanceStore = useBitcoinDominanceStore();

const { data, isLoading, isError } = useQueryBintcoinDominance(
	computed(() => bitcoinDominanceStore.selectedTickersIds),
);

const isNotData = computed(() => !!data.value && isLoading.value);

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
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data?.tickers"
				:data="data.tickers"
				:meta="meta"
			/>
		</template>
		<template #rcm>
			<bitcoin-dominance-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>
