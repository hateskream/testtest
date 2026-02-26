<script setup lang="ts">

import type { IMeta } from '@/modules/dashboard-group';
import { useEthGas } from '../../composables';
import { BaseWidgetDashboard } from '@/modules/widgets/base';

import ErrorComponent from '../common/error-component.vue';
import PreloaderComponent from '../common/preloader-component.vue';
import ViewComponent from '../common/view-component.vue';

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
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:all-display-variants="props.meta.allDisplayVariants"
		:active-display-variant="props.meta.activeDisplayVariant"
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@retry="refetch"
	>
		<template #content>
			<error-component v-if="dataState.isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="dataState.data"
				:view-state="viewState"
				:gas-stats="dataState.data.gasStats"
				:gas-cards="dataState.data.gasCardData"
				:size="props.meta.size"
			/>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}
</style>
