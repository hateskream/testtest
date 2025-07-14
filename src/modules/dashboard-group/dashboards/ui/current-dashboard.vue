<script setup lang="ts">
import { computed } from 'vue';

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

const meta = computed((): IMeta => ({
	market: '',
	isResizing: props.isResizing,
	size: {
		h: props.dashboardItem.position.h,
		w: props.dashboardItem.position.w,
	},
	name: props.dashboardItem.name,
}));

</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.widgetType)"
		:meta="meta"
		@delete="emit('delete')"
	/>
</template>
