<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import type { ISettings } from '../model';

import RcmPriceComponent from './rcm-price-component.vue';

const settings = defineModel<ISettings>({ required: true });

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
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<rcm-price-component v-model="settings" />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
