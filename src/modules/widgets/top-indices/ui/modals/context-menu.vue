<script setup lang="ts">
import { WidgetContextMenu } from '@/modules/widgets/base';

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
		:has-reset="false"
		@delete="emit('delete')"
	/>
</template>
