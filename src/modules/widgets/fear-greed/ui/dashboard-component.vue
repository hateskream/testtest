<script setup lang="ts">

import { defineAsyncComponent } from 'vue';

import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { useFearGreed } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

import FearGreedContextMenu from './fear-greed-context-menu.vue';
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

const { viewState, dataState, isNotData, resetAllChanges, refetch } = useFearGreed(props.meta.widgetId);

const emit = defineEmits<{
	delete: [];
}>();

</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>

		<template #content>
			<preloader-component v-if="isNotData || props.meta.isLoading" />
			<base-error-component
				v-else-if="dataState.isError"
				@retry="refetch"
			/>
			<view-component
				v-else-if="dataState.data"
				:view-state="viewState"
				:tension="dataState.data"
				:size="meta.size"
			/>
		</template>

		<template #rcm>
			<fear-greed-context-menu
				v-model="viewState"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}
</style>
