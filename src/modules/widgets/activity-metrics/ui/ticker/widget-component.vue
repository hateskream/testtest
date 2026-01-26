<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent } from '@/modules/widgets/base';
import { useActivityMetrics } from '../../composables';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
}

const props = defineProps<IWidgetComponentProps>();

const {
	data,
	isLoading,
	isError,
	refetch,
} = useActivityMetrics({
	tickerId: () => props.meta.tickerId,
});
</script>

<template>
	<div>
		<base-error-component v-if="isError" @retry="refetch" />
		<preloader-component v-else-if="isLoading" />
		<view-component
			v-else-if="data"
			:metrics="data"
		/>
	</div>
</template>
