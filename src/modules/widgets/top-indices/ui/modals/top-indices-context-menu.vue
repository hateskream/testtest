<script setup lang="ts">
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';

const props = defineProps<{
	title: string;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const performanceStore = usePerformanceStore();
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="performanceStore.resetAll"
	>

		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<!-- <performance-filter /> -->
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
