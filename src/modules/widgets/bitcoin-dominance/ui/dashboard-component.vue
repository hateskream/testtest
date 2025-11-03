<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseWidgetTvComponent } from '../../base/index.ts';
import { useQueryBintcoinDominance } from '../queries/use-query-bitcoin-dominance.ts';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance.ts';
import { BaseErrorComponent, ModalItemSwitch } from '@/modules/widgets/base';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
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

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="bitcoinDominanceStore.resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
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
		<template #change-display>
			<modal-item-switch
				:model-value="bitcoinDominanceStore.isShowIndicator"
				@update:model-value="bitcoinDominanceStore.toggleShowIndicator"
			>
				Segmented indicator
			</modal-item-switch>

			<modal-item-switch
				:model-value="bitcoinDominanceStore.isShowHistorical"
				@update:model-value="bitcoinDominanceStore.toggleShowHistorical"
			>
				Historical values
			</modal-item-switch>

			<modal-item-switch
				:model-value="bitcoinDominanceStore.isShowChart"
				@update:model-value="bitcoinDominanceStore.toggleShowChart"
			>
				Chart
			</modal-item-switch>
		</template>
	</base-widget-tv-component>
</template>
