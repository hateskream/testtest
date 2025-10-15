<script setup lang="ts">

import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group';
import { useFearGreed } from '../composables';

import FearGreedContextMenu from './fear-greed-context-menu.vue';
import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { viewState, dataState, isNotData, resetAllChanges } = useFearGreed(props.meta.widgetId);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

</script>

<template>
	<base-dashboard-component :meta="props.meta" :has-reset="false">
		<template #title>
			{{ props.meta.name }}
		</template>

		<template #content>
			<error-component v-if="dataState.isError" />
			<preloader-component v-else-if="isNotData" />
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
