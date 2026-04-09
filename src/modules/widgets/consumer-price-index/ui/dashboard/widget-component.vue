<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, useWidgetState } from '@/modules/widgets/base';
import { FiltersPanel, PreloaderComponent } from '../common';
import { useCpiState } from '../../composables';
import { getDefaultState, type IState } from '../../model';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const { updateState } = useWidgetContext();

const { state } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState,
	onStateChange: (s) => updateState(s),
});

const {
	activeValueType,
	activeRange,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useCpiState({ state });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@retry="refetch"
	>
		<template #filters>
			<filters-panel
				v-model:range="activeRange"
				v-model:value-type="activeValueType"
				display-variant="new"
				is-show-range
				@reset="resetAllChanges"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else-if="data"
				:data="data"
				:value-type="activeValueType"
			/>
		</template>
	</base-widget-dashboard>
</template>
