<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import type { ISettings } from '../model';

import RcmPriceComponent from './rcm-price-component.vue';

const settings = defineModel<ISettings>({ required: true });

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
		@delete="emit('delete')"
		@reset="emit('reset')"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<rcm-price-component v-model="settings" />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
