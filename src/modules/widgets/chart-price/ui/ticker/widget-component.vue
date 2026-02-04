<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef, watchEffect } from 'vue';
import { useScrollLock } from '@vueuse/core';

import { BaseErrorComponent } from '@/modules/widgets/base';
import { useTickerChartPrice } from '../../composables';
import { useFocusLock } from '@/shared/ui/modal';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
	delay: 0,
});

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
	handleScale?: boolean;
}

const props = defineProps<IWidgetComponentProps>();

const fullView = defineModel<boolean>('fullView', { default: false });

const {
	data,
	overview,
	dateRange,
	timezone,
	chartType,
	isError,
	isLoading,
	refetch,
} = useTickerChartPrice(() => props.meta.tickerId);

const container = useTemplateRef('container');

const { lock: lockContainerFocus, unlock: unlockContainerFocus } = useFocusLock(container);
const scrollIsLocked = useScrollLock(document);

watchEffect(() => {
	if (!container.value) {
		return;
	}

	if (fullView.value) {
		lockContainerFocus();
		scrollIsLocked.value = true;
	} else {
		unlockContainerFocus();
		scrollIsLocked.value = false;
	}
});
</script>

<template>
	<teleport to="body" :disabled="!fullView">
		<div ref="container" :class="[classes.container, { [classes.full]: fullView }]">
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data && overview"
				v-model:date-range="dateRange"
				v-model:timezone="timezone"
				v-model:chart-type="chartType"
				v-model:full-view="fullView"
				:data="data"
				:overview="overview"
				:handle-scale="props.handleScale"
			/>
		</div>
	</teleport>
</template>

<style module="classes">
.container {
	height: 100%;
}

.container.full {
	position: fixed;
	top: 0;
	left: 0;
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	padding: var(--padding-s9, 16px) var(--padding-s11, 20px);
	overflow: hidden;
	background-color: var(--surface-00, #000000);
}
</style>
