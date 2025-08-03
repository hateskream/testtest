<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { useFearGreedStore } from '../stores';

import RcmFearGreedComponent from './rcm-fear-greed-component.vue';

const fearGreedStore = useFearGreedStore();

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
		@reset="fearGreedStore.resetAllChanges"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<rcm-fear-greed-component />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
