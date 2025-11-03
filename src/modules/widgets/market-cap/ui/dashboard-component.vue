<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useQueryMarketCap } from '../queries/use-query-market-cap.ts';
import { useMarketCapStore } from '../store/market-cap.ts';
import { BaseErrorComponent, BaseWidgetTvComponent, ModalItemCheckbox } from '@/modules/widgets/base';

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
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="marketCap.resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
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
		<template #change-display>
			<modal-item-checkbox
				:model-value="marketCap.isShowChart"
				@update:model-value="marketCap.toggleShowChart"
			>
				Chart
			</modal-item-checkbox>
			<modal-item-checkbox
				:model-value="marketCap.isShowChange"
				@update:model-value="marketCap.toggleShowChange"
			>
				Change, %
			</modal-item-checkbox>
		</template>
	</base-widget-tv-component>
</template>
