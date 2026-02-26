<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useFearGreed } from '../../composables';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';

import RcmFearGreedComponent from '../rcm-fear-greed-component.vue';
import PreloaderComponent from '../preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetExposed {
	snapHeightToNearestStep?(contentHeight: number): number;
}

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	viewState,
	dataState,
	isNotData,
	resetAllChanges,
	refetch,
} = useFearGreed({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});

const emit = defineEmits<{
	delete: [];
	duplicate: [];
	moveTo: [dashboardId: string];
}>();

const refComponent = ref<IWidgetExposed | null>(null);

function snapHeightToNearestStep(contentHeight: number): number {
	if (!refComponent.value?.snapHeightToNearestStep) {
		return contentHeight;
	}

	return refComponent.value.snapHeightToNearestStep(contentHeight);
}

defineExpose({ snapHeightToNearestStep });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
		<template #content>
			<preloader-component v-if="isNotData || props.meta.isLoading" />
			<base-error-component
				v-else-if="dataState.isError"
				@retry="refetch"
			/>
			<view-component
				v-else-if="dataState.data"
				ref="refComponent"
				:view-state="viewState"
				:tension="dataState.data"
				:size="meta.size"
				:column-width="meta.columnWidth"
				display-variant="new"
			/>
		</template>

		<template #change-display>
			<rcm-fear-greed-component v-model="viewState" />
		</template>
	</base-widget-dashboard>
</template>
