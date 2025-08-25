<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { useWatchlistStore } from '../stores';

const watchlistStore = useWatchlistStore();

const props = defineProps<{
	title: string;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="watchlistStore.resetAll"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<!-- <modal-submenu-content> -->
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
