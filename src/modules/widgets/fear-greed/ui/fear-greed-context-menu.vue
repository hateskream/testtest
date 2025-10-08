<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import type { ISettings } from '../model';

import RcmFearGreedComponent from './rcm-fear-greed-component.vue';

interface IFearGreedContextMenu {
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}

const props = defineProps<IFearGreedContextMenu>();

const settings = defineModel<ISettings>({ required: true });

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'duplicate'): void;
	(e: 'reset'): void;
	(e: 'moveTo', dashboardId: string): void;
}>();
</script>

<template>
	<widget-context-menu
		:title="props.title"
		:dashboards="props.dashboards"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@reset="emit('reset')"
		@move-to="emit('moveTo', $event)"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<rcm-fear-greed-component v-model="settings" />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
