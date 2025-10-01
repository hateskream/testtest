<script setup lang="ts">
import { computed } from 'vue';

import {
	type IWidget,
	type IMeta,
} from '../../core';
import { getWidgetComponent } from '../utils';
import { useDelayedLoading } from '@/shared/composables';

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

const { loading } = useDelayedLoading();

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
	isLoading: loading.value,
}));
</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.widgetType)"
		:meta="meta"
		:data-loading="loading"
		@delete="emit('delete')"
	/>
</template>
