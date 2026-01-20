<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseWidgetTvComponent } from '../../../base';
import type { IMeta } from '@/modules/dashboard-group';
import { useFearGreed } from '../../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

import RcmFearGreedComponent from '../rcm-fear-greed-component.vue';
import PreloaderComponent from '../preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

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

</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
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
				display-variant="default"
			/>
		</template>

		<template #change-display>
			<rcm-fear-greed-component v-model="viewState" />
		</template>
	</base-widget-tv-component>
</template>
