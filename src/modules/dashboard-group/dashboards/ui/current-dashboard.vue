<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import {
	type IWidget,
	type IMeta,
} from '../../core';
import { getWidgetComponent } from '../utils';

interface IGroupComponentProps {
	dashboardItem: IWidget;
	isResizing?: boolean;
}

const props = withDefaults(defineProps<IGroupComponentProps>(), {
	market: '',
	isResizing: false,
});

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const isLoading = ref(true);

const meta = computed((): IMeta => ({
	market: '',
	widgetId: props.dashboardItem.id,
	isResizing: props.isResizing,
	size: {
		h: props.dashboardItem.position.h,
		w: props.dashboardItem.position.w,
	},
	name: props.dashboardItem.name,
	defaultStateType: props.dashboardItem.defaultStateType,
	isLoading: isLoading.value,
}));

function showWithLoadingDelay() {
	isLoading.value = true;

	nextTick(() => {
		setTimeout(() => {
			isLoading.value	= false;
		}, 50);
	});
}

showWithLoadingDelay();
</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.widgetType)"
		:meta="meta"
		:data-loading="isLoading"
		@delete="emit('delete')"
	/>
</template>
