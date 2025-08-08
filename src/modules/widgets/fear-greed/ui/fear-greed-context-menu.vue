<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';

import RcmFearGreedComponent from './rcm-fear-greed-component.vue';

interface ISettingsModel {
	isShowChart: boolean;
	isShowName: boolean;
	isShowDescription: boolean;
	isShowPastValues: boolean;
}

interface IFearGreedContextMenu {
	title: string;
}

const props = defineProps<IFearGreedContextMenu>();

const settings = defineModel<ISettingsModel>({ required: true });

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
				<rcm-fear-greed-component v-model="settings" />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
