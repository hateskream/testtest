<script setup lang="ts">

import { BaseWidgetTvComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group';
import { useEthGas } from '../composables';

import EthGasContextMenu from './eth-gas-context-menu.vue';
import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { viewState, dataState, isNotData, resetAllChanges, refetch } = useEthGas(props.meta.widgetId);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		:has-reset="false"
		@retry="refetch"
	>
		<template #title>
			{{ props.meta.name }}
		</template>

		<template #content>
			<error-component v-if="dataState.isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="dataState.data"
				:view-state="viewState"
				:gas-stats="dataState.data.gasStats"
				:gas-cards="dataState.data.gasCardData"
				:size="meta.size"
			/>
		</template>

		<template #rcm>
			<eth-gas-context-menu
				:meta="meta"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}
</style>
