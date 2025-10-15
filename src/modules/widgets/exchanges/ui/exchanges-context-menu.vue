<script setup lang="ts">
import {
	WidgetContextMenu,
} from '../../base';


const props = defineProps<{
	title: string;
}>();


const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
}>();
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>

	</widget-context-menu>
</template>
