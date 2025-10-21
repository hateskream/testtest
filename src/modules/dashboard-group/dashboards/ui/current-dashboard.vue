<script setup lang="ts">
import { computed } from 'vue';

import {
	type IWidget,
} from '../../tv';
import { getWidgetComponent, type IMeta } from '../model';
import { useDelayedLoading } from '@/shared/composables';

interface IGroupComponentProps {
	dashboardItem: IWidget;
	columnWidth: number;
	rowHeight: number;
	isResizing?: boolean;
	dashboards?: {
		id: string;
		name: string;
	}[];
}

const props = withDefaults(defineProps<IGroupComponentProps>(), {
	market: '',
	isResizing: false,
	dashboards: () => [],
});

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
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
	maxSize: {
		h: props.dashboardItem.maxSize.h,
		w: props.dashboardItem.maxSize.w,
	},
	name: props.dashboardItem.name,
	defaultStateType: props.dashboardItem.defaultStateType,
	isLoading: loading.value,
	dashboards: props.dashboards,
	widgetType: props.dashboardItem.widgetType,
	isOpenFull: false,
	columnWidth: props.columnWidth,
	rowHeight: props.rowHeight,
}));
</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.widgetType)"
		:meta="meta"
		:data-loading="loading"
		@delete="emit('delete')"
		@move-to="emit('moveTo', $event)"
	/>
</template>
