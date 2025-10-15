<script setup lang="ts">
import {
	WidgetContextMenu,
} from '../../base';
import type { IMeta } from '@/modules/dashboard-group';


const props = defineProps<{
	title: string;
	meta: IMeta;

}>();


const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
}>();
</script>

<template>
	<widget-context-menu
		:dashboards="meta.dashboards"
		:title="props.title"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>

	</widget-context-menu>
</template>
