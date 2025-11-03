<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { useBitcoinDominanceStore } from '../../store/bitcoin-dominance.ts';
import { useQueryBintcoinDominance } from '../../queries/use-query-bitcoin-dominance.ts';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
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
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<modal-ticker-selector-with-badge
				v-model="bitcoinDominanceStore.selectedTickers"
				display-variant="new"
			/>
		</template>
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
	</base-widget-dashboard>
</template>
