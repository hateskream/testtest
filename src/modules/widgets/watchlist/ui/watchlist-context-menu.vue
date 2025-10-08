<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';

const props = defineProps<{
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

</script>

<template>
	<widget-context-menu
		:title="props.title"
		:dashboards="props.dashboards"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
